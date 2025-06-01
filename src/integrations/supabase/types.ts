export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bonus_offers: {
        Row: {
          color: string | null
          created_at: string
          description: string
          icon_name: string | null
          id: string
          reward: string
          target: number
          timeframe: string
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description: string
          icon_name?: string | null
          id?: string
          reward: string
          target: number
          timeframe: string
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string
          icon_name?: string | null
          id?: string
          reward?: string
          target?: number
          timeframe?: string
          title?: string
        }
        Relationships: []
      }
      cases: {
        Row: {
          client_id: string
          created_at: string
          id: string
          name: string
          status: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          name: string
          status?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount: number
          case_id: string | null
          client_id: string | null
          created_at: string
          description: string | null
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          case_id?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          case_id?: string | null
          client_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "earnings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      gifts: {
        Row: {
          created_at: string
          description: string
          id: string
          image_emoji: string | null
          required_referrals: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_emoji?: string | null
          required_referrals: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_emoji?: string | null
          required_referrals?: number
          title?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          admin_note: string | null
          case_name: string | null
          client_name: string | null
          completed_at: string | null
          created_at: string
          documents: Json | null
          id: string
          invoice_amount: string | null
          last_update: string | null
          payment_info: string | null
          status: string
          task_type: string
          title: string
          uploaded_documents: string[] | null
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          case_name?: string | null
          client_name?: string | null
          completed_at?: string | null
          created_at?: string
          documents?: Json | null
          id?: string
          invoice_amount?: string | null
          last_update?: string | null
          payment_info?: string | null
          status?: string
          task_type: string
          title: string
          uploaded_documents?: string[] | null
          user_id: string
        }
        Update: {
          admin_note?: string | null
          case_name?: string | null
          client_name?: string | null
          completed_at?: string | null
          created_at?: string
          documents?: Json | null
          id?: string
          invoice_amount?: string | null
          last_update?: string | null
          payment_info?: string | null
          status?: string
          task_type?: string
          title?: string
          uploaded_documents?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_paid: boolean
          profile_picture: string | null
          referral_code: string
          referred_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          is_paid?: boolean
          profile_picture?: string | null
          referral_code: string
          referred_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_paid?: boolean
          profile_picture?: string | null
          referral_code?: string
          referred_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
