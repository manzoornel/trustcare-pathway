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
      appointments: {
        Row: {
          created_at: string | null
          date: string
          doctor: string
          ehr_reference_id: string | null
          id: string
          location: string
          patient_id: string | null
          status: string | null
          time: string
          type: string
        }
        Insert: {
          created_at?: string | null
          date: string
          doctor: string
          ehr_reference_id?: string | null
          id?: string
          location: string
          patient_id?: string | null
          status?: string | null
          time: string
          type: string
        }
        Update: {
          created_at?: string | null
          date?: string
          doctor?: string
          ehr_reference_id?: string | null
          id?: string
          location?: string
          patient_id?: string | null
          status?: string | null
          time?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ehr_integration: {
        Row: {
          api_endpoint: string
          api_key: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync_time: string | null
        }
        Insert: {
          api_endpoint: string
          api_key: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_time?: string | null
        }
        Update: {
          api_endpoint?: string
          api_key?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_time?: string | null
        }
        Relationships: []
      }
      ehr_sync_history: {
        Row: {
          details: string | null
          id: string
          message: string
          patient_id: string | null
          status: string
          timestamp: string
        }
        Insert: {
          details?: string | null
          id?: string
          message: string
          patient_id?: string | null
          status: string
          timestamp?: string
        }
        Update: {
          details?: string | null
          id?: string
          message?: string
          patient_id?: string | null
          status?: string
          timestamp?: string
        }
        Relationships: []
      }
      lab_reports: {
        Row: {
          created_at: string | null
          date: string
          doctor: string
          ehr_reference_id: string | null
          id: string
          patient_id: string | null
          results: Json
          status: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          date: string
          doctor: string
          ehr_reference_id?: string | null
          id?: string
          patient_id?: string | null
          results: Json
          status?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          date?: string
          doctor?: string
          ehr_reference_id?: string | null
          id?: string
          patient_id?: string | null
          results?: Json
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_summaries: {
        Row: {
          created_at: string | null
          date: string
          doctor: string
          ehr_reference_id: string | null
          id: string
          notes: string
          patient_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          date: string
          doctor: string
          ehr_reference_id?: string | null
          id?: string
          notes: string
          patient_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          date?: string
          doctor?: string
          ehr_reference_id?: string | null
          id?: string
          notes?: string
          patient_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_summaries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string | null
          doctor: string
          dosage: string
          ehr_reference_id: string | null
          frequency: string
          id: string
          name: string
          patient_id: string | null
          prescribed: string
        }
        Insert: {
          created_at?: string | null
          doctor: string
          dosage: string
          ehr_reference_id?: string | null
          frequency: string
          id?: string
          name: string
          patient_id?: string | null
          prescribed: string
        }
        Update: {
          created_at?: string | null
          doctor?: string
          dosage?: string
          ehr_reference_id?: string | null
          frequency?: string
          id?: string
          name?: string
          patient_id?: string | null
          prescribed?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          hospital_id: string | null
          id: string
          name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          hospital_id?: string | null
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          hospital_id?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      patient_rewards: {
        Row: {
          id: string
          patient_id: string | null
          points: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          patient_id?: string | null
          points?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          patient_id?: string | null
          points?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_rewards_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_transactions: {
        Row: {
          amount: number | null
          created_at: string | null
          date: string
          description: string
          id: string
          patient_id: string | null
          points: number
          type: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          date: string
          description: string
          id?: string
          patient_id?: string | null
          points: number
          type: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          patient_id?: string | null
          points?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_transactions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_ehr_integration: {
        Args: { config_id: string; user_id: string }
        Returns: boolean
      }
      create_ehr_integration: {
        Args: {
          api_endpoint_param: string
          api_key_param: string
          user_id: string
        }
        Returns: boolean
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
