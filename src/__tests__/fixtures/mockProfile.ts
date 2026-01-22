import type { ProfileData } from '@/types/profile'

/**
 * Mock profile data for testing public-profiles app
 * Based on realistic executive profile structure
 */
export const mockProfileData: ProfileData = {
  name: 'Alex Johnson',
  role: 'Fractional Chief Product Officer',
  summary: 'Seasoned product leader with 15+ years of experience scaling B2B SaaS companies.',
  location: 'San Francisco, CA',
  personas: [
    {
      title: 'Strategic Growth Leader',
      bullets: [
        'Scaled SaaS companies from $5M to $50M ARR',
        'Built high-performing product teams',
      ],
    },
  ],
  superpowers: [
    {
      title: 'Strategic Vision',
      description: 'Translating business challenges into actionable roadmaps',
    },
  ],
  industries: ['Enterprise Software', 'FinTech'],
  focus_areas: ['Product Strategy', 'Team Building'],
  profile_version: '0.3',
  linkedinurl: 'https://linkedin.com/in/alexjohnson',
}

/**
 * Mock RPC response for get_anon_profile (anonymized profile)
 */
export const mockAnonProfileResponse = {
  anon_slug: 'strategic-growth-leader-sf',
  anon_profile_data: {
    ...mockProfileData,
    name: undefined, // Anonymized - no name in public view
    linkedinurl: undefined, // Anonymized
  },
  profile_version: '0.3',
}

/**
 * Mock RPC response for get_public_profile_by_id (full profile for preview)
 */
export const mockPublicProfileByIdResponse = {
  profile_id: '123e4567-e89b-12d3-a456-426614174000',
  profile_data: mockProfileData,
  profile_version: '0.3',
  linkedinurl: 'https://linkedin.com/in/alexjohnson',
}
