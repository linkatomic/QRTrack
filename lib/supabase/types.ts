export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
          created_at?: string
          updated_at?: string
        }
      }
      qr_codes: {
        Row: {
          id: string
          user_id: string
          name: string
          destination_url: string
          short_code: string
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          qr_color: string
          qr_style: string | null
          qr_eye_style: string | null
          qr_bg_color: string | null
          qr_gradient_type: string | null
          qr_gradient_color: string | null
          qr_logo_url: string | null
          qr_size: number | null
          qr_error_correction: string | null
          qr_margin: number | null
          enable_tracking: boolean | null
          qr_template: string | null
          qr_frame_style: string | null
          qr_frame_color: string | null
          qr_frame_text: string | null
          transparent_bg: boolean | null
          download_format: string | null
          landing_page_enabled: boolean
          landing_page_title: string | null
          landing_page_description: string | null
          landing_page_logo_url: string | null
          landing_page_cta_text: string
          status: string
          expires_at: string | null
          total_scans: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          destination_url: string
          short_code: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          qr_color?: string
          qr_style?: string | null
          qr_eye_style?: string | null
          qr_bg_color?: string | null
          qr_gradient_type?: string | null
          qr_gradient_color?: string | null
          qr_logo_url?: string | null
          qr_size?: number | null
          qr_error_correction?: string | null
          qr_margin?: number | null
          enable_tracking?: boolean | null
          qr_template?: string | null
          qr_frame_style?: string | null
          qr_frame_color?: string | null
          qr_frame_text?: string | null
          transparent_bg?: boolean | null
          download_format?: string | null
          landing_page_enabled?: boolean
          landing_page_title?: string | null
          landing_page_description?: string | null
          landing_page_logo_url?: string | null
          landing_page_cta_text?: string
          status?: string
          expires_at?: string | null
          total_scans?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          destination_url?: string
          short_code?: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          qr_color?: string
          qr_style?: string | null
          qr_eye_style?: string | null
          qr_bg_color?: string | null
          qr_gradient_type?: string | null
          qr_gradient_color?: string | null
          qr_logo_url?: string | null
          qr_size?: number | null
          qr_error_correction?: string | null
          qr_margin?: number | null
          enable_tracking?: boolean | null
          qr_template?: string | null
          qr_frame_style?: string | null
          qr_frame_color?: string | null
          qr_frame_text?: string | null
          transparent_bg?: boolean | null
          download_format?: string | null
          landing_page_enabled?: boolean
          landing_page_title?: string | null
          landing_page_description?: string | null
          landing_page_logo_url?: string | null
          landing_page_cta_text?: string
          status?: string
          expires_at?: string | null
          total_scans?: number
          created_at?: string
          updated_at?: string
        }
      }
      scans: {
        Row: {
          id: string
          qr_code_id: string
          scanned_at: string
          user_agent: string | null
          device_type: string | null
          os: string | null
          browser: string | null
          country: string | null
          city: string | null
          referrer: string | null
          ip_address: string | null
          utm_snapshot: Json | null
        }
        Insert: {
          id?: string
          qr_code_id: string
          scanned_at?: string
          user_agent?: string | null
          device_type?: string | null
          os?: string | null
          browser?: string | null
          country?: string | null
          city?: string | null
          referrer?: string | null
          ip_address?: string | null
          utm_snapshot?: Json | null
        }
        Update: {
          id?: string
          qr_code_id?: string
          scanned_at?: string
          user_agent?: string | null
          device_type?: string | null
          os?: string | null
          browser?: string | null
          country?: string | null
          city?: string | null
          referrer?: string | null
          ip_address?: string | null
          utm_snapshot?: Json | null
        }
      }
    }
  }
}
