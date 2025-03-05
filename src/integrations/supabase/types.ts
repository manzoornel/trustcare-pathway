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
      lab_reports: {
        Row: {
          created_at: string | null
          date: string
          doctor: string
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
          id: string
          notes: string
          patient_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          date: string
          doctor: string
          id?: string
          notes: string
          patient_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          date?: string
          doctor?: string
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
