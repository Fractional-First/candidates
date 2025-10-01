export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      countries: {
        Row: {
          alpha2_code: string
          alpha3_code: string
          country_code: number
          created_at: string | null
          id: string
          intermediate_region: string | null
          intermediate_region_code: number | null
          iso_3166_2: string | null
          name: string
          region: string | null
          region_code: number | null
          sub_region: string | null
          sub_region_code: number | null
          updated_at: string | null
        }
        Insert: {
          alpha2_code: string
          alpha3_code: string
          country_code: number
          created_at?: string | null
          id?: string
          intermediate_region?: string | null
          intermediate_region_code?: number | null
          iso_3166_2?: string | null
          name: string
          region?: string | null
          region_code?: number | null
          sub_region?: string | null
          sub_region_code?: number | null
          updated_at?: string | null
        }
        Update: {
          alpha2_code?: string
          alpha3_code?: string
          country_code?: number
          created_at?: string | null
          id?: string
          intermediate_region?: string | null
          intermediate_region_code?: number | null
          iso_3166_2?: string | null
          name?: string
          region?: string | null
          region_code?: number | null
          sub_region?: string | null
          sub_region_code?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fractional_industry_preferences: {
        Row: {
          created_at: string
          id: string
          industry_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          industry_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fractional_industry_preferences_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fractional_industry_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fractional_location_preferences: {
        Row: {
          created_at: string
          id: string
          location_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fractional_location_preferences_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fractional_location_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fractional_preferences: {
        Row: {
          created_at: string
          id: string
          max_daily_rate: number | null
          max_hourly_rate: number | null
          max_hours_per_week: number | null
          min_daily_rate: number | null
          min_hourly_rate: number | null
          min_hours_per_week: number | null
          open_for_work: boolean
          payment_type: string | null
          remote_ok: boolean | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_daily_rate?: number | null
          max_hourly_rate?: number | null
          max_hours_per_week?: number | null
          min_daily_rate?: number | null
          min_hourly_rate?: number | null
          min_hours_per_week?: number | null
          open_for_work?: boolean
          payment_type?: string | null
          remote_ok?: boolean | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_daily_rate?: number | null
          max_hourly_rate?: number | null
          max_hours_per_week?: number | null
          min_daily_rate?: number | null
          min_hourly_rate?: number | null
          min_hours_per_week?: number | null
          open_for_work?: boolean
          payment_type?: string | null
          remote_ok?: boolean | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fractional_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      full_time_industry_preferences: {
        Row: {
          created_at: string
          id: string
          industry_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          industry_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "full_time_industry_preferences_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "full_time_industry_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      full_time_location_preferences: {
        Row: {
          created_at: string
          id: string
          location_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "full_time_location_preferences_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "full_time_location_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      full_time_preferences: {
        Row: {
          created_at: string
          id: string
          max_salary: number | null
          min_salary: number | null
          open_for_work: boolean
          remote_ok: boolean | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_salary?: number | null
          min_salary?: number | null
          open_for_work?: boolean
          remote_ok?: boolean | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_salary?: number | null
          min_salary?: number | null
          open_for_work?: boolean
          remote_ok?: boolean | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "full_time_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          city: string | null
          country_code: string | null
          created_at: string
          formatted_address: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          place_id: string
          place_types: string[] | null
          state_province: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          created_at?: string
          formatted_address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          place_id: string
          place_types?: string[] | null
          state_province?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          country_code?: string | null
          created_at?: string
          formatted_address?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          place_id?: string
          place_types?: string[] | null
          state_province?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["alpha2_code"]
          },
        ]
      }
      profile_documents: {
        Row: {
          created_at: string
          file_size: number | null
          id: string
          mime_type: string | null
          original_filename: string
          storage_path: string
          title: string | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          original_filename: string
          storage_path: string
          title?: string | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          original_filename?: string
          storage_path?: string
          title?: string | null
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_embeddings: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          id: string
          last_embedded_at: string | null
          metadata: Json | null
          profile_id: string | null
          text_hash: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          last_embedded_at?: string | null
          metadata?: Json | null
          profile_id?: string | null
          text_hash?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          last_embedded_at?: string | null
          metadata?: Json | null
          profile_id?: string | null
          text_hash?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          ispublished: boolean | null
          last_name: string | null
          linkedinurl: string | null
          notification_preferences: Json | null
          onboarding_status: Database["public"]["Enums"]["onboarding_status"]
          profile_data: Json
          profile_data_original: Json | null
          profile_slug: string
          profile_version: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          ispublished?: boolean | null
          last_name?: string | null
          linkedinurl?: string | null
          notification_preferences?: Json | null
          onboarding_status?: Database["public"]["Enums"]["onboarding_status"]
          profile_data?: Json
          profile_data_original?: Json | null
          profile_slug: string
          profile_version?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          ispublished?: boolean | null
          last_name?: string | null
          linkedinurl?: string | null
          notification_preferences?: Json | null
          onboarding_status?: Database["public"]["Enums"]["onboarding_status"]
          profile_data?: Json
          profile_data_original?: Json | null
          profile_slug?: string
          profile_version?: string
          updated_at?: string
        }
        Relationships: []
      }
      timezones: {
        Row: {
          abbr: string
          created_at: string | null
          id: string
          isdst: boolean
          text: string
          updated_at: string | null
          utc: string[]
          utc_offset: number
          value: string
        }
        Insert: {
          abbr: string
          created_at?: string | null
          id?: string
          isdst: boolean
          text: string
          updated_at?: string | null
          utc: string[]
          utc_offset: number
          value: string
        }
        Update: {
          abbr?: string
          created_at?: string | null
          id?: string
          isdst?: boolean
          text?: string
          updated_at?: string | null
          utc?: string[]
          utc_offset?: number
          value?: string
        }
        Relationships: []
      }
      user_location_preferences: {
        Row: {
          created_at: string
          id: string
          location_id: string
          preference_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          preference_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          preference_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_location_preferences_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_location_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_work_eligibility: {
        Row: {
          country_code: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          country_code: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_work_eligibility_country_code_fkey"
            columns: ["country_code"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["alpha2_code"]
          },
          {
            foreignKeyName: "user_work_eligibility_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_preferences: {
        Row: {
          created_at: string
          current_location_id: string | null
          id: string
          timezone_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_location_id?: string | null
          id?: string
          timezone_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_location_id?: string | null
          id?: string
          timezone_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_preferences_current_location_id_fkey"
            columns: ["current_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_preferences_timezone_id_fkey"
            columns: ["timezone_id"]
            isOneToOne: false
            referencedRelation: "timezones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      generate_unique_profile_slug: {
        Args: { p_first_name: string; p_last_name: string; p_user_id: string }
        Returns: string
      }
      get_public_profile: {
        Args: { profile_slug_param: string }
        Returns: {
          first_name: string
          last_name: string
          profile_data: Json
          profile_slug: string
        }[]
      }
      get_public_profile_by_id: {
        Args: { profile_id_param: string }
        Returns: {
          first_name: string
          last_name: string
          profile_data: Json
          profile_slug: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      document_type: "resume" | "linkedin" | "other"
      onboarding_status:
        | "SIGNED_UP"
        | "EMAIL_CONFIRMED"
        | "PROFILE_GENERATED"
        | "PROFILE_CONFIRMED"
        | "PREFERENCES_SET"
        | "SET_PASSWORD"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_type: ["resume", "linkedin", "other"],
      onboarding_status: [
        "SIGNED_UP",
        "EMAIL_CONFIRMED",
        "PROFILE_GENERATED",
        "PROFILE_CONFIRMED",
        "PREFERENCES_SET",
        "SET_PASSWORD",
      ],
    },
  },
} as const
