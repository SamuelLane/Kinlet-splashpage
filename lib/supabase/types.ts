export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      pass_intake_locations: {
        Row: {
          city: string;
          created_at: string;
          id: string;
          offer_description: string;
          offer_restrictions: string | null;
          pos_system: string | null;
          pos_system_other: string | null;
          preferred_promo_code: string | null;
          state: string;
          street: string;
          submission_id: string;
          valid_days: string[];
          zip: string;
        };
        Insert: {
          city: string;
          created_at?: string;
          id?: string;
          offer_description: string;
          offer_restrictions?: string | null;
          pos_system?: string | null;
          pos_system_other?: string | null;
          preferred_promo_code?: string | null;
          state: string;
          street: string;
          submission_id: string;
          valid_days?: string[];
          zip: string;
        };
        Update: {
          city?: string;
          created_at?: string;
          id?: string;
          offer_description?: string;
          offer_restrictions?: string | null;
          pos_system?: string | null;
          pos_system_other?: string | null;
          preferred_promo_code?: string | null;
          state?: string;
          street?: string;
          submission_id?: string;
          valid_days?: string[];
          zip?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pass_intake_locations_submission_id_fkey";
            columns: ["submission_id"];
            isOneToOne: false;
            referencedRelation: "pass_intake_submissions";
            referencedColumns: ["id"];
          },
        ];
      };
      pass_intake_submissions: {
        Row: {
          additional_notes: string | null;
          business_name: string;
          business_phone: string | null;
          business_type: string;
          business_type_other: string | null;
          business_website: string | null;
          created_at: string | null;
          franchise_authority: string | null;
          franchise_brand_name: string | null;
          id: string;
          ip_address: string | null;
          is_franchise: boolean;
          logo_url: string | null;
          marketing_opt_in: boolean | null;
          redemption_cadence: string;
          submitter_email: string;
          submitter_name: string;
          submitter_role: string;
          user_agent: string | null;
        };
        Insert: {
          additional_notes?: string | null;
          business_name: string;
          business_phone?: string | null;
          business_type: string;
          business_type_other?: string | null;
          business_website?: string | null;
          created_at?: string | null;
          franchise_authority?: string | null;
          franchise_brand_name?: string | null;
          id?: string;
          ip_address?: string | null;
          is_franchise?: boolean;
          logo_url?: string | null;
          marketing_opt_in?: boolean | null;
          redemption_cadence?: string;
          submitter_email: string;
          submitter_name: string;
          submitter_role: string;
          user_agent?: string | null;
        };
        Update: {
          additional_notes?: string | null;
          business_name?: string;
          business_phone?: string | null;
          business_type?: string;
          business_type_other?: string | null;
          business_website?: string | null;
          created_at?: string | null;
          franchise_authority?: string | null;
          franchise_brand_name?: string | null;
          id?: string;
          ip_address?: string | null;
          is_franchise?: boolean;
          logo_url?: string | null;
          marketing_opt_in?: boolean | null;
          redemption_cadence?: string;
          submitter_email?: string;
          submitter_name?: string;
          submitter_role?: string;
          user_agent?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
