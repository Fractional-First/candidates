import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Camera, Upload, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ProfilePictureUploadProps {
  currentImage?: string;
  userName: string;
  onImageUpdate: (imageUrl: string) => void;
  readOnly?: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  userName,
  onImageUpdate,
  readOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Start with no crop as recommended by react-image-crop docs
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { uploadImage, deleteImage, isUploading } = useImageUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setIsEditing(true);
        // Reset crop states - will be set properly in handleImageLoad
        setCrop(undefined);
        setCompletedCrop(undefined);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image load to set initial completed crop with proper pixel values
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    
    // Calculate a square crop centered in the image
    const minDimension = Math.min(naturalWidth, naturalHeight);
    const x = (naturalWidth - minDimension) / 2;
    const y = (naturalHeight - minDimension) / 2;
    
    // Set initial crop to be square and centered using percentage
    const initialCrop: Crop = {
      unit: '%',
      x: (x / naturalWidth) * 100,
      y: (y / naturalHeight) * 100,
      width: (minDimension / naturalWidth) * 100,
      height: (minDimension / naturalHeight) * 100
    };
    
    // Set the crop
    setCrop(initialCrop);
    
    // Also set completedCrop in pixel values for processing
    setCompletedCrop({
      unit: 'px',
      x: x,
      y: y,
      width: minDimension,
      height: minDimension
    });
  };

  const getCroppedImageFile = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!imgRef.current || !canvasRef.current || !completedCrop) {
        resolve(null);
        return;
      }

      const image = imgRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(null);
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas size to the crop size (should be square)
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      // Draw the cropped image
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
          resolve(file);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.9);
    });
  }, [completedCrop]);

  const handleSave = async () => {
    const croppedFile = await getCroppedImageFile();
    if (!croppedFile) {
      toast({
        title: "Error",
        description: "Failed to process the cropped image.",
        variant: "destructive"
      });
      return;
    }

    // Delete the old image if it exists and is from our storage
    if (currentImage && currentImage.includes('profile-images')) {
      await deleteImage(currentImage);
    }

    // Upload the new image
    const imageUrl = await uploadImage(croppedFile, 'profile');
    
    if (imageUrl) {
      onImageUpdate(imageUrl);
      setIsEditing(false);
      setSelectedImage(null);
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated."
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filter initials to only include alphabetic characters
  const initials = userName
    .split(' ')
    .map(n => n.replace(/[^A-Za-z]/g, '')) // Remove non-alphabetic characters
    .filter(n => n.length > 0) // Remove empty strings
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <div className="relative group">
        <Avatar className="h-48 w-48 border-4 border-white shadow-lg">
          <AvatarImage src={currentImage} alt={userName} />
          <AvatarFallback className="text-4xl bg-teal-100 text-teal-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        {!readOnly && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-white hover:text-white hover:bg-white/20"
              disabled={isUploading}
            >
              <Camera className="h-6 w-6 mr-2" />
              {isUploading ? 'Uploading...' : 'Change Photo'}
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Crop Dialog */}
      <Dialog open={isEditing} onOpenChange={handleCancel}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedImage && (
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={selectedImage}
                    alt="Crop preview"
                    style={{ maxHeight: '400px', maxWidth: '100%' }}
                    onLoad={handleImageLoad}
                  />
                </ReactCrop>
              </div>
            )}
            
            <div className="text-sm text-gray-600 text-center">
              Drag to reposition and resize your photo. The image will be cropped to a circle.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-teal-600 hover:bg-teal-700"
              disabled={isUploading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isUploading ? 'Saving..' : 'Save Photo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
};

export default ProfilePictureUpload;
