import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockAnonProfileResponse, mockPublicProfileByIdResponse, mockProfileData } from '../fixtures/mockProfile'

// Mock the entire module that creates the client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    rpc: vi.fn(),
  })),
}))

// Import after mocking - this will use the mocked createClient
import { supabase } from '@/lib/supabase-server'

// Re-import the functions to test (they use the mocked supabase)
const { getPublicProfileBySlug, getPublicProfileById } = await import('@/lib/supabase-server')

describe('supabase-server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPublicProfileBySlug', () => {
    it('fetches anonymized profile successfully', async () => {
      // Arrange
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: [mockAnonProfileResponse],
        error: null,
      } as any)

      // Act
      const result = await getPublicProfileBySlug('strategic-growth-leader-sf')

      // Assert
      expect(supabase.rpc).toHaveBeenCalledWith('get_anon_profile', {
        anon_slug_param: 'strategic-growth-leader-sf',
      })

      expect(result).toMatchObject({
        role: mockProfileData.role,
        summary: mockProfileData.summary,
        profile_version: '0.3',
      })

      // Verify anonymized data doesn't include name
      expect(result?.name).toBeUndefined()
    })

    it('returns null when profile not found', async () => {
      // Arrange
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: [],
        error: null,
      } as any)

      // Act
      const result = await getPublicProfileBySlug('nonexistent-profile')

      // Assert
      expect(result).toBeNull()
    })

    it('throws PROFILE_NOT_PUBLISHED for 42501 permission error', async () => {
      // Arrange
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: null,
        error: {
          code: '42501',
          message: 'permission denied',
        },
      } as any)

      // Act & Assert
      await expect(getPublicProfileBySlug('unpublished-profile')).rejects.toThrow(
        'PROFILE_NOT_PUBLISHED'
      )
    })

    it('throws PROFILE_NOT_PUBLISHED when error contains "not published"', async () => {
      // Arrange
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Profile is not published',
        },
      } as any)

      // Act & Assert
      await expect(getPublicProfileBySlug('draft-profile')).rejects.toThrow(
        'PROFILE_NOT_PUBLISHED'
      )
    })

    it('rethrows generic errors as-is', async () => {
      // Arrange
      const genericError = {
        code: 'PGRST116',
        message: 'Some database error',
      }
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: null,
        error: genericError,
      } as any)

      // Act & Assert
      await expect(getPublicProfileBySlug('error-profile')).rejects.toMatchObject(
        genericError
      )
    })
  })

  describe('getPublicProfileById', () => {
    it('fetches full profile by id (for preview mode)', async () => {
      // Arrange
      const profileId = '123e4567-e89b-12d3-a456-426614174000'
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: [mockPublicProfileByIdResponse],
        error: null,
      } as any)

      // Act
      const result = await getPublicProfileById(profileId)

      // Assert
      expect(supabase.rpc).toHaveBeenCalledWith('get_public_profile_by_id', {
        profile_id_param: profileId,
      })

      expect(result).toMatchObject({
        name: mockProfileData.name,
        role: mockProfileData.role,
        profile_version: '0.3',
        linkedinurl: 'https://linkedin.com/in/alexjohnson',
      })
    })

    it('returns null when profile id not found', async () => {
      // Arrange
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: [],
        error: null,
      } as any)

      // Act
      const result = await getPublicProfileById('nonexistent-id')

      // Assert
      expect(result).toBeNull()
    })

    it('throws errors from database', async () => {
      // Arrange
      const dbError = {
        code: 'PGRST116',
        message: 'Database error',
      }
      vi.mocked(supabase.rpc).mockResolvedValueOnce({
        data: null,
        error: dbError,
      } as any)

      // Act & Assert
      await expect(getPublicProfileById('error-id')).rejects.toMatchObject(dbError)
    })
  })
})
