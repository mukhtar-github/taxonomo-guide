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
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string
          created_at: string
          id: string
          mono_account_id: string
          updated_at: string
          user_id: string
          webhook_secret: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          bank_name: string
          created_at?: string
          id?: string
          mono_account_id: string
          updated_at?: string
          user_id: string
          webhook_secret?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          mono_account_id?: string
          updated_at?: string
          user_id?: string
          webhook_secret?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_type: string | null
          company_name: string
          created_at: string | null
          id: string
          tax_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          business_type?: string | null
          company_name: string
          created_at?: string | null
          id?: string
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_type?: string | null
          company_name?: string
          created_at?: string | null
          id?: string
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tax_calculations: {
        Row: {
          calculation_details: Json | null
          calculation_type: string | null
          created_at: string | null
          id: string
          period_end: string
          period_start: string
          profile_id: string | null
          status: string | null
          submission_date: string | null
          tax_payable: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          calculation_details?: Json | null
          calculation_type?: string | null
          created_at?: string | null
          id?: string
          period_end: string
          period_start: string
          profile_id?: string | null
          status?: string | null
          submission_date?: string | null
          tax_payable: number
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          calculation_details?: Json | null
          calculation_type?: string | null
          created_at?: string | null
          id?: string
          period_end?: string
          period_start?: string
          profile_id?: string | null
          status?: string | null
          submission_date?: string | null
          tax_payable?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_calculations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          amount_ngn: number | null
          bank_account_id: string | null
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          exchange_rate: number | null
          id: string
          mono_transaction_id: string
          profile_id: string | null
          transaction_date: string
        }
        Insert: {
          amount: number
          amount_ngn?: number | null
          bank_account_id?: string | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          exchange_rate?: number | null
          id?: string
          mono_transaction_id: string
          profile_id?: string | null
          transaction_date: string
        }
        Update: {
          amount?: number
          amount_ngn?: number | null
          bank_account_id?: string | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          exchange_rate?: number | null
          id?: string
          mono_transaction_id?: string
          profile_id?: string | null
          transaction_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
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
