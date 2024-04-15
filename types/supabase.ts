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
      integrations: {
        Row: {
          auth_type: Database["public"]["Enums"]["auth_type"] | null
          id: string
          logo: string | null
          name: string
          type: Database["public"]["Enums"]["integration_type"] | null
        }
        Insert: {
          auth_type?: Database["public"]["Enums"]["auth_type"] | null
          id?: string
          logo?: string | null
          name: string
          type?: Database["public"]["Enums"]["integration_type"] | null
        }
        Update: {
          auth_type?: Database["public"]["Enums"]["auth_type"] | null
          id?: string
          logo?: string | null
          name?: string
          type?: Database["public"]["Enums"]["integration_type"] | null
        }
        Relationships: []
      }
      organization_integrations: {
        Row: {
          client_id: string | null
          integration: string
          organization: string
          secret_key: string | null
        }
        Insert: {
          client_id?: string | null
          integration: string
          organization: string
          secret_key?: string | null
        }
        Update: {
          client_id?: string | null
          integration?: string
          organization?: string
          secret_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_organization_integrations_integration_fkey"
            columns: ["integration"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_organization_integrations_organization_fkey"
            columns: ["organization"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          default_template: number | null
          id: string
          labor_rate: number
          name: string
          slug: string | null
          visibility_settings: Json
        }
        Insert: {
          default_template?: number | null
          id?: string
          labor_rate: number
          name: string
          slug?: string | null
          visibility_settings?: Json
        }
        Update: {
          default_template?: number | null
          id?: string
          labor_rate?: number
          name?: string
          slug?: string | null
          visibility_settings?: Json
        }
        Relationships: []
      }
      phases: {
        Row: {
          description: string
          hours: number
          id: string
          order: number
          reference_id: number | null
          version: string
          visible: boolean | null
        }
        Insert: {
          description: string
          hours?: number
          id?: string
          order?: number
          reference_id?: number | null
          version: string
          visible?: boolean | null
        }
        Update: {
          description?: string
          hours?: number
          id?: string
          order?: number
          reference_id?: number | null
          version?: string
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "public_phases_version_fkey"
            columns: ["version"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_overrides: Json | null
          calculated_cost: number | null
          calculated_price: number | null
          catalog_item: number | null
          category: string | null
          cost: number | null
          description: string | null
          id: number | null
          identifier: string | null
          manufacturer_part_number: string | null
          parent: string | null
          parent_catalog_item: number | null
          price: number | null
          product_class: string | null
          quantity: number
          recurring_bill_cycle: number | null
          recurring_cost: number | null
          recurring_cycle_type: string | null
          recurring_flag: boolean | null
          section: string | null
          sequence_number: number | null
          taxable_flag: boolean | null
          type: string | null
          unique_id: string
          unit_of_measure: string | null
          vendor: string | null
          version: string
        }
        Insert: {
          additional_overrides?: Json | null
          calculated_cost?: number | null
          calculated_price?: number | null
          catalog_item?: number | null
          category?: string | null
          cost?: number | null
          description?: string | null
          id?: number | null
          identifier?: string | null
          manufacturer_part_number?: string | null
          parent?: string | null
          parent_catalog_item?: number | null
          price?: number | null
          product_class?: string | null
          quantity?: number
          recurring_bill_cycle?: number | null
          recurring_cost?: number | null
          recurring_cycle_type?: string | null
          recurring_flag?: boolean | null
          section?: string | null
          sequence_number?: number | null
          taxable_flag?: boolean | null
          type?: string | null
          unique_id?: string
          unit_of_measure?: string | null
          vendor?: string | null
          version: string
        }
        Update: {
          additional_overrides?: Json | null
          calculated_cost?: number | null
          calculated_price?: number | null
          catalog_item?: number | null
          category?: string | null
          cost?: number | null
          description?: string | null
          id?: number | null
          identifier?: string | null
          manufacturer_part_number?: string | null
          parent?: string | null
          parent_catalog_item?: number | null
          price?: number | null
          product_class?: string | null
          quantity?: number
          recurring_bill_cycle?: number | null
          recurring_cost?: number | null
          recurring_cycle_type?: string | null
          recurring_flag?: boolean | null
          section?: string | null
          sequence_number?: number | null
          taxable_flag?: boolean | null
          type?: string | null
          unique_id?: string
          unit_of_measure?: string | null
          vendor?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_products_2_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["unique_id"]
          },
          {
            foreignKeyName: "public_products_section_fkey"
            columns: ["section"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_products_version_fkey"
            columns: ["version"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          manage_reference_id: number | null
          organization: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          manage_reference_id?: number | null
          organization?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          manage_reference_id?: number | null
          organization?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_fkey"
            columns: ["organization"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          catalog_items: number[] | null
          created_at: string
          created_by: string | null
          current_version: string | null
          expiration_date: string | null
          id: string
          labor_hours: number
          labor_rate: number
          name: string
          opportunity_id: number | null
          organization: string | null
          project_id: number | null
          service_ticket: number | null
          status: Database["public"]["Enums"]["status"]
          templates_used: number[] | null
          updated_at: string
          working_version: string | null
        }
        Insert: {
          catalog_items?: number[] | null
          created_at?: string
          created_by?: string | null
          current_version?: string | null
          expiration_date?: string | null
          id?: string
          labor_hours?: number
          labor_rate?: number
          name: string
          opportunity_id?: number | null
          organization?: string | null
          project_id?: number | null
          service_ticket?: number | null
          status?: Database["public"]["Enums"]["status"]
          templates_used?: number[] | null
          updated_at?: string
          working_version?: string | null
        }
        Update: {
          catalog_items?: number[] | null
          created_at?: string
          created_by?: string | null
          current_version?: string | null
          expiration_date?: string | null
          id?: string
          labor_hours?: number
          labor_rate?: number
          name?: string
          opportunity_id?: number | null
          organization?: string | null
          project_id?: number | null
          service_ticket?: number | null
          status?: Database["public"]["Enums"]["status"]
          templates_used?: number[] | null
          updated_at?: string
          working_version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_organization_fkey"
            columns: ["organization"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_proposals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_proposals_current_version_fkey"
            columns: ["current_version"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_proposals_working_version_fkey"
            columns: ["working_version"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          created_at: string
          id: string
          name: string
          order: number
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order?: number
          version: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order?: number
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_sections_version_fkey"
            columns: ["version"]
            isOneToOne: false
            referencedRelation: "versions"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          id: string
          notes: string
          priority: number
          reference_id: number | null
          summary: string
          ticket: string
          visibile: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          notes: string
          priority: number
          reference_id?: number | null
          summary: string
          ticket: string
          visibile?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string
          priority?: number
          reference_id?: number | null
          summary?: string
          ticket?: string
          visibile?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "tasks_ticket_fkey"
            columns: ["ticket"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          budget_hours: number
          created_at: string
          id: string
          order: number
          phase: string
          reference_id: number | null
          summary: string
          visible: boolean
        }
        Insert: {
          budget_hours?: number
          created_at?: string
          id?: string
          order?: number
          phase: string
          reference_id?: number | null
          summary: string
          visible?: boolean
        }
        Update: {
          budget_hours?: number
          created_at?: string
          id?: string
          order?: number
          phase?: string
          reference_id?: number | null
          summary?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "public_tickets_phase_fkey"
            columns: ["phase"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
        ]
      }
      versions: {
        Row: {
          created_at: string
          id: string
          name: string | null
          number: number | null
          proposal: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          number?: number | null
          proposal: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          number?: number | null
          proposal?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_version_proposal_fkey"
            columns: ["proposal"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      duplicate_phases: {
        Args: {
          original_id: string
          new_id: string
        }
        Returns: undefined
      }
      duplicate_products: {
        Args: {
          original_id: string
          new_id: string
        }
        Returns: undefined
      }
      duplicate_tasks: {
        Args: {
          original_id: string
          new_id: string
        }
        Returns: undefined
      }
      duplicate_tickets: {
        Args: {
          original_id: string
          new_id: string
        }
        Returns: undefined
      }
      get_organization_from_phase: {
        Args: {
          phase_id: string
        }
        Returns: {
          id: string
          name: string
          labor_rate: number
          slug: string
          default_template: number
          visibility_settings: Json
        }[]
      }
      is_organization_member: {
        Args: {
          organization_id: string
          user_id: string
        }
        Returns: boolean
      }
      is_proposal_shared: {
        Args: {
          proposal_id: string
          user_id: string
        }
        Returns: boolean
      }
      jsonb_diff_val: {
        Args: {
          val1: Json
          val2: Json
        }
        Returns: Json
      }
      slugify: {
        Args: {
          value: string
        }
        Returns: string
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
    }
    Enums: {
      auth_type: "OAuth2"
      integration_type: "reseller" | "distribution" | "email"
      status: "building" | "inProgress" | "signed" | "canceled"
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
