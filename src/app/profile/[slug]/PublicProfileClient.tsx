"use client"

import { useState } from "react"
import { ProfileData, Persona, Superpower } from "@/types/profile"
import { BasicInfoSection } from "@/components/edit-profile/BasicInfoSection"
import { EditableArraySection } from "@/components/edit-profile/EditableArraySection"
import { EditableTextSection } from "@/components/edit-profile/EditableTextSection"
import { FunctionalSkillsSection } from "@/components/edit-profile/FunctionalSkillsSection"
import { PersonasSection } from "@/components/edit-profile/PersonasSection"
import { SuperpowersSection } from "@/components/edit-profile/SuperpowersSection"
import ProfilePictureUpload from "@/components/ProfilePictureUpload"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/toaster"

interface PublicProfileClientProps {
  profileData: ProfileData
  showClaimBanner: boolean
}

export default function PublicProfileClient({
  profileData,
  showClaimBanner,
}: PublicProfileClientProps) {
  const [personasActiveTab, setPersonasActiveTab] = useState("0")

  // Transform data to ensure correct format for components
  const transformPersonas = (personas: any[]): Persona[] => {
    if (!personas || !Array.isArray(personas)) return []
    return personas.map((persona, index) => {
      if (typeof persona === "string") {
        return { title: persona, bullets: [] }
      }
      if (persona.title && persona.bullets) {
        return persona
      }
      if (persona.name) {
        return { title: persona.name, bullets: [] }
      }
      return { title: `Persona ${index + 1}`, bullets: [] }
    })
  }

  const transformSuperpowers = (superpowers: any[]): Superpower[] => {
    if (!superpowers || !Array.isArray(superpowers)) return []
    return superpowers.map((superpower, index) => {
      if (typeof superpower === "string") {
        return { title: superpower, description: "" }
      }
      if (superpower.title && superpower.description) {
        return superpower
      }
      if (superpower.name) {
        return {
          title: superpower.name,
          description: superpower.description || "",
        }
      }
      return { title: `Superpower ${index + 1}`, description: "" }
    })
  }

  const transformArrayData = (data: any[]): string[] => {
    if (!data || !Array.isArray(data)) return []
    return data.map((item) => {
      if (typeof item === "string") return item
      if (item.name) return item.name
      if (item.title) return item.title
      return String(item)
    })
  }

  const handleShareProfile = async () => {
    const profileUrl = window.location.href

    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success("Profile link copied!", {
        description: "Ready to share.",
        duration: 3000,
        position: "top-center",
      })
    } catch (error) {
      toast.error("Failed to copy link", {
        description: "Please copy the link manually.",
        duration: 3000,
        position: "top-center",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header matching site style */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <a href="https://fractionalfirst.com">
                <img
                  src="/lovable-uploads/daefe55a-8953-4582-8fc8-12a66755ac2a.png"
                  alt="Fractional First"
                  className="h-12 w-auto cursor-pointer"
                />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleShareProfile}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Claim banner for new profiles */}
      {showClaimBanner && (
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 border-b border-teal-400">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white">
                <h3 className="font-semibold text-lg">
                  🎉 Your profile has been generated! Claim it now to make it
                  yours.
                </h3>
                <p className="text-sm opacity-90 mt-1">
                  Sign up to edit, customize, and publish your professional
                  profile.
                </p>
              </div>
              <Button
                asChild
                className="bg-white text-teal-600 hover:bg-teal-50 font-medium whitespace-nowrap"
              >
                <a href="/signup">Claim Your Profile</a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Anonymous Profile Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 border-b border-teal-400">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg">
                Want to see more candidates like this?
              </h3>
              <p className="text-sm opacity-90 mt-1">
                This is an anonymous profile. Contact Fractional First to view
                full profiles and discover more world-class fractional
                executives.
              </p>
            </div>
            <Button
              asChild
              className="bg-white text-teal-600 hover:bg-teal-50 font-medium whitespace-nowrap"
            >
              <a
                href="https://www.fractionalfirst.com/orgs"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Full Profiles
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 p-6">
        {/* Main Layout - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image and Basic Info */}
            <div className="text-center">
              <div className="relative mb-4 inline-block">
                <ProfilePictureUpload
                  currentImage={profileData?.profilePicture}
                  userName={profileData?.name || "User"}
                  onImageUpdate={() => {}} // No-op for read-only
                  readOnly={true}
                  isAnonymous={true}
                />
              </div>

              <div className="space-y-2">
                <BasicInfoSection
                  content=""
                  name={profileData?.name || ""}
                  role={profileData?.role || ""}
                  location={profileData?.location || ""}
                  isEditing={false}
                  onEditToggle={() => {}} // No-op for read-only
                  onChange={() => {}} // No-op for read-only
                  readOnly={true}
                />

                {/* LinkedIn Link */}
                {profileData?.linkedinurl && (
                  <div className="flex justify-center mt-4">
                    <a
                      href={profileData.linkedinurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-80"
                      aria-label="View LinkedIn Profile"
                    >
                      <img
                        src="/lovable-uploads/2c01f7e9-f692-45b8-8183-ab3763bd33d1.png"
                        alt="LinkedIn"
                        className="h-6 w-6"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <EditableTextSection
              content=""
              title="Description"
              value={profileData?.summary || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="Description not available"
              className="bg-white"
              headerClassName="bg-[#449889] text-white"
              labelClassName="text-base font-semibold"
              readOnly={true}
            />

            {/* Key Roles */}
            <EditableArraySection
              content=""
              title="Key Roles"
              items={transformArrayData(profileData.highlights || [])}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onChange={() => {}} // No-op for read-only
              placeholder="Key role"
              addLabel="Add Role"
              displayType="bullets"
              readOnly={true}
            />

            {/* Education - Desktop only (0.3+) */}
            {(!profileData.profile_version ||
              profileData.profile_version >= "0.3") && (
              <div className="hidden lg:block">
                <EditableArraySection
                  content=""
                  title="Education"
                  items={transformArrayData(profileData.education || [])}
                  isEditing={false}
                  onEditToggle={() => {}} // No-op for read-only
                  onChange={() => {}} // No-op for read-only
                  placeholder="Education"
                  addLabel="Add Education"
                  displayType="bullets"
                  readOnly={true}
                />
              </div>
            )}

            {/* Focus Areas - Desktop only */}
            <div className="hidden lg:block">
              <EditableArraySection
                content=""
                title="Focus Areas"
                items={transformArrayData(profileData.focus_areas || [])}
                isEditing={false}
                onEditToggle={() => {}} // No-op for read-only
                onChange={() => {}} // No-op for read-only
                placeholder="Focus area"
                addLabel="Add Area"
                readOnly={true}
              />
            </div>

            {/* Industries - Desktop only */}
            <div className="hidden lg:block">
              <EditableArraySection
                content=""
                title="Industries"
                items={transformArrayData(profileData.industries || [])}
                isEditing={false}
                onEditToggle={() => {}} // No-op for read-only
                onChange={() => {}} // No-op for read-only
                placeholder="Industry"
                addLabel="Add Industry"
                readOnly={true}
              />
            </div>

            {/* Geographical Coverage - Desktop only */}
            <div className="hidden lg:block">
              <EditableArraySection
                content=""
                title="Geographical Coverage"
                items={transformArrayData(
                  profileData.geographical_coverage || []
                )}
                isEditing={false}
                onEditToggle={() => {}} // No-op for read-only
                onChange={() => {}} // No-op for read-only
                placeholder="Region"
                addLabel="Add Region"
                readOnly={true}
              />
            </div>

            {/* Stage - Desktop only */}
            <div className="hidden lg:block">
              <EditableArraySection
                content=""
                title="Stage"
                items={transformArrayData(profileData.stage_focus || [])}
                isEditing={false}
                onEditToggle={() => {}} // No-op for read-only
                onChange={() => {}} // No-op for read-only
                placeholder="Stage"
                addLabel="Add Stage"
                readOnly={true}
              />
            </div>

            {/* Personal Interests - Desktop only */}
            <div className="hidden lg:block">
              <EditableArraySection
                content=""
                title="Personal Interests"
                items={transformArrayData(profileData.personal_interests || [])}
                isEditing={false}
                onEditToggle={() => {}} // No-op for read-only
                onChange={() => {}} // No-op for read-only
                placeholder="Interest"
                addLabel="Add Interest"
                readOnly={true}
              />
            </div>

            {/* Certifications - Desktop only */}
            {profileData.certifications &&
              profileData.certifications.length > 0 && (
                <div className="hidden lg:block">
                  <EditableArraySection
                    content=""
                    title="Certifications"
                    items={transformArrayData(profileData.certifications || [])}
                    isEditing={false}
                    onEditToggle={() => {}} // No-op for read-only
                    onChange={() => {}} // No-op for read-only
                    placeholder="Certification"
                    addLabel="Add Certification"
                    readOnly={true}
                  />
                </div>
              )}
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meet Section */}
            <EditableTextSection
              content=""
              title="Meet Me"
              value={profileData?.meet_them || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="Introduction not available"
              bgColorClass="bg-[#449889]"
              textColorClass="text-white"
              headerClassName="bg-[#449889] text-white"
              labelClassName="text-lg font-semibold"
              textAreaClass="text-white bg-[#449889]"
              readOnly={true}
            />

            {/* Personas Section */}
            <PersonasSection
              content=""
              personas={transformPersonas(profileData.personas || [])}
              personaEditStates={{}}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onPersonaLocalUpdate={() => {}} // No-op for read-only
              onAddPersona={() => {}} // No-op for read-only
              onRemovePersona={() => {}} // No-op for read-only
              activeTab={personasActiveTab}
              onActiveTabChange={setPersonasActiveTab}
              readOnly={true}
            />

            {/* Superpowers Section */}
            <SuperpowersSection
              content=""
              superpowers={transformSuperpowers(profileData.superpowers || [])}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onSuperpowersChange={() => {}} // No-op for read-only
              readOnly={true}
            />

            {/* Sweet Spot Section */}
            <EditableTextSection
              content=""
              title="Sweet Spot"
              value={profileData?.sweetspot || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="Sweet spot not available"
              className="bg-white"
              headerClassName="bg-[#449889] text-white"
              labelClassName="text-lg font-semibold"
              readOnly={true}
            />

            {/* Functional Skills */}
            <FunctionalSkillsSection
              content=""
              functionalSkills={profileData.functional_skills || {}}
              profileVersion={profileData.profile_version}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onFunctionalSkillsChange={() => {}} // No-op for read-only
              readOnly={true}
            />

            {/* User Manual */}
            <EditableTextSection
              content=""
              title="User Manual"
              value={profileData?.user_manual || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="User manual not available"
              className="bg-white"
              headerClassName="bg-[#449889] text-white"
              labelClassName="text-lg font-semibold"
              readOnly={true}
            />

            {/* Mobile/Tablet sections moved below User Manual */}
            <div className="lg:hidden space-y-6 mt-6">
              {/* Education - Mobile/Tablet only (0.3+) */}
              {(!profileData.profile_version ||
                profileData.profile_version >= "0.3") && (
                <EditableArraySection
                  content=""
                  title="Education"
                  items={transformArrayData(profileData.education || [])}
                  isEditing={false}
                  onEditToggle={() => {}} // No-op for read-only
                  onChange={() => {}} // No-op for read-only
                  placeholder="Education"
                  addLabel="Add Education"
                  displayType="bullets"
                  readOnly={true}
                />
              )}

              {/* Focus Areas - Mobile/Tablet only */}
              <EditableArraySection
                content=""
                title="Focus Areas"
                items={profileData.focus_areas || []}
                isEditing={false}
                onEditToggle={() => {}} // No-op for read-only
                onChange={() => {}} // No-op for read-only
                placeholder="Focus area"
                addLabel="Add Area"
                readOnly={true}
              />

              {/* Industries - Mobile/Tablet only */}
              <EditableArraySection
                content=""
                title="Industries"
                items={transformArrayData(profileData.industries || [])}
                isEditing={false}
                onEditToggle={() => {}} // No-op for read-only
                onChange={() => {}} // No-op for read-only
                placeholder="Industry"
                addLabel="Add Industry"
                readOnly={true}
              />

              {/* Geographical Coverage - Mobile/Tablet only */}
              <EditableArraySection
                content=""
                title="Geographical Coverage"
                items={transformArrayData(
                  profileData.geographical_coverage || []
                )}
                isEditing={false}
                onEditToggle={() => {}} // No-op for read-only
                onChange={() => {}} // No-op for read-only
                placeholder="Region"
                addLabel="Add Region"
                readOnly={true}
              />

              {/* Stage - Mobile/Tablet only */}
              <EditableArraySection
                content=""
                title="Stage"
                items={transformArrayData(profileData.stage_focus || [])}
                isEditing={false}
                onEditToggle={() => {}} // No-op for read-only
                onChange={() => {}} // No-op for read-only
                placeholder="Stage"
                addLabel="Add Stage"
                readOnly={true}
              />

              {/* Personal Interests - Mobile/Tablet only */}
              <EditableArraySection
                content=""
                title="Personal Interests"
                items={transformArrayData(profileData.personal_interests || [])}
                isEditing={false}
                onEditToggle={() => {}} // No-op for read-only
                onChange={() => {}} // No-op for read-only
                placeholder="Interest"
                addLabel="Add Interest"
                readOnly={true}
              />

              {/* Certifications - Mobile/Tablet only */}
              {profileData.certifications &&
                profileData.certifications.length > 0 && (
                  <EditableArraySection
                    content=""
                    title="Certifications"
                    items={transformArrayData(profileData.certifications || [])}
                    isEditing={false}
                    onEditToggle={() => {}} // No-op for read-only
                    onChange={() => {}} // No-op for read-only
                    placeholder="Certification"
                    addLabel="Add Certification"
                    readOnly={true}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
