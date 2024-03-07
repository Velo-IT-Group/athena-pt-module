export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			integrations: {
				Row: {
					auth_type: Database['public']['Enums']['auth_type'] | null;
					id: string;
					logo: string | null;
					name: string;
					type: Database['public']['Enums']['integration_type'] | null;
				};
				Insert: {
					auth_type?: Database['public']['Enums']['auth_type'] | null;
					id?: string;
					logo?: string | null;
					name: string;
					type?: Database['public']['Enums']['integration_type'] | null;
				};
				Update: {
					auth_type?: Database['public']['Enums']['auth_type'] | null;
					id?: string;
					logo?: string | null;
					name?: string;
					type?: Database['public']['Enums']['integration_type'] | null;
				};
				Relationships: [];
			};
			organization_integrations: {
				Row: {
					client_id: string | null;
					integration: string;
					organization: string;
				};
				Insert: {
					client_id?: string | null;
					integration: string;
					organization: string;
				};
				Update: {
					client_id?: string | null;
					integration?: string;
					organization?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'public_organization_integrations_integration_fkey';
						columns: ['integration'];
						isOneToOne: false;
						referencedRelation: 'integrations';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_organization_integrations_organization_fkey';
						columns: ['organization'];
						isOneToOne: false;
						referencedRelation: 'organizations';
						referencedColumns: ['id'];
					}
				];
			};
			organizations: {
				Row: {
					default_template: number | null;
					id: string;
					labor_rate: number;
					name: string;
					slug: string | null;
					visibility_settings: Json;
				};
				Insert: {
					default_template?: number | null;
					id?: string;
					labor_rate: number;
					name: string;
					slug?: string | null;
					visibility_settings?: Json;
				};
				Update: {
					default_template?: number | null;
					id?: string;
					labor_rate?: number;
					name?: string;
					slug?: string | null;
					visibility_settings?: Json;
				};
				Relationships: [];
			};
			phases: {
				Row: {
					description: string;
					hours: number;
					id: string;
					order: number;
					proposal: string | null;
					visible: boolean | null;
				};
				Insert: {
					description: string;
					hours?: number;
					id?: string;
					order?: number;
					proposal?: string | null;
					visible?: boolean | null;
				};
				Update: {
					description?: string;
					hours?: number;
					id?: string;
					order?: number;
					proposal?: string | null;
					visible?: boolean | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_phases_proposal_fkey';
						columns: ['proposal'];
						isOneToOne: false;
						referencedRelation: 'proposals';
						referencedColumns: ['id'];
					}
				];
			};
			pricing: {
				Row: {
					amount: number;
					description: string | null;
					id: number;
					is_default: boolean;
					organization: string | null;
				};
				Insert: {
					amount: number;
					description?: string | null;
					id?: number;
					is_default?: boolean;
					organization?: string | null;
				};
				Update: {
					amount?: number;
					description?: string | null;
					id?: number;
					is_default?: boolean;
					organization?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_pricing_organization_fkey';
						columns: ['organization'];
						isOneToOne: false;
						referencedRelation: 'organizations';
						referencedColumns: ['id'];
					}
				];
			};
			products: {
				Row: {
					catalog_item_id: number | null;
					cost: number | null;
					extended_price: number | null;
					id: string;
					is_phase_item: boolean | null;
					is_recurring: boolean | null;
					is_taxable: boolean | null;
					manufacturing_part_number: string | null;
					name: string;
					notes: string | null;
					parent: string | null;
					price: number;
					proposal: string;
					quantity: number;
					suggested_price: number | null;
					vendor_name: string | null;
					vendor_part_number: string | null;
				};
				Insert: {
					catalog_item_id?: number | null;
					cost?: number | null;
					extended_price?: number | null;
					id?: string;
					is_phase_item?: boolean | null;
					is_recurring?: boolean | null;
					is_taxable?: boolean | null;
					manufacturing_part_number?: string | null;
					name?: string;
					notes?: string | null;
					parent?: string | null;
					price?: number;
					proposal: string;
					quantity?: number;
					suggested_price?: number | null;
					vendor_name?: string | null;
					vendor_part_number?: string | null;
				};
				Update: {
					catalog_item_id?: number | null;
					cost?: number | null;
					extended_price?: number | null;
					id?: string;
					is_phase_item?: boolean | null;
					is_recurring?: boolean | null;
					is_taxable?: boolean | null;
					manufacturing_part_number?: string | null;
					name?: string;
					notes?: string | null;
					parent?: string | null;
					price?: number;
					proposal?: string;
					quantity?: number;
					suggested_price?: number | null;
					vendor_name?: string | null;
					vendor_part_number?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_products_parent_fkey';
						columns: ['parent'];
						isOneToOne: false;
						referencedRelation: 'products';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_products_proposal_fkey';
						columns: ['proposal'];
						isOneToOne: false;
						referencedRelation: 'proposals';
						referencedColumns: ['id'];
					}
				];
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					full_name: string | null;
					id: string;
					organization: string | null;
					updated_at: string | null;
					username: string | null;
					website: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					full_name?: string | null;
					id: string;
					organization?: string | null;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					full_name?: string | null;
					id?: string;
					organization?: string | null;
					updated_at?: string | null;
					username?: string | null;
					website?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'profiles_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'profiles_organization_fkey';
						columns: ['organization'];
						isOneToOne: false;
						referencedRelation: 'organizations';
						referencedColumns: ['id'];
					}
				];
			};
			proposals: {
				Row: {
					company_name: string | null;
					created_at: string;
					hours_required: number | null;
					id: string;
					labor_hours: number;
					labor_rate: number;
					management_hours: number;
					name: string;
					organization: string | null;
					sales_hours: number;
					service_ticket: number | null;
					templates_used: number[] | null;
					total_labor_price: number;
					total_price: number | null;
					total_product_price: number;
					updated_at: string;
				};
				Insert: {
					company_name?: string | null;
					created_at?: string;
					hours_required?: number | null;
					id?: string;
					labor_hours?: number;
					labor_rate?: number;
					management_hours?: number;
					name: string;
					organization?: string | null;
					sales_hours?: number;
					service_ticket?: number | null;
					templates_used?: number[] | null;
					total_labor_price?: number;
					total_price?: number | null;
					total_product_price?: number;
					updated_at?: string;
				};
				Update: {
					company_name?: string | null;
					created_at?: string;
					hours_required?: number | null;
					id?: string;
					labor_hours?: number;
					labor_rate?: number;
					management_hours?: number;
					name?: string;
					organization?: string | null;
					sales_hours?: number;
					service_ticket?: number | null;
					templates_used?: number[] | null;
					total_labor_price?: number;
					total_price?: number | null;
					total_product_price?: number;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'proposals_organization_fkey';
						columns: ['organization'];
						isOneToOne: false;
						referencedRelation: 'organizations';
						referencedColumns: ['id'];
					}
				];
			};
			tasks: {
				Row: {
					created_at: string;
					id: string;
					notes: string;
					priority: number;
					summary: string;
					ticket: string;
					visibile: boolean;
				};
				Insert: {
					created_at?: string;
					id?: string;
					notes: string;
					priority: number;
					summary: string;
					ticket: string;
					visibile?: boolean;
				};
				Update: {
					created_at?: string;
					id?: string;
					notes?: string;
					priority?: number;
					summary?: string;
					ticket?: string;
					visibile?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: 'tasks_ticket_fkey';
						columns: ['ticket'];
						isOneToOne: false;
						referencedRelation: 'tickets';
						referencedColumns: ['id'];
					}
				];
			};
			tickets: {
				Row: {
					budget_hours: number;
					created_at: string;
					id: string;
					order: number;
					phase: string;
					summary: string;
					visible: boolean;
				};
				Insert: {
					budget_hours?: number;
					created_at?: string;
					id?: string;
					order?: number;
					phase: string;
					summary: string;
					visible?: boolean;
				};
				Update: {
					budget_hours?: number;
					created_at?: string;
					id?: string;
					order?: number;
					phase?: string;
					summary?: string;
					visible?: boolean;
				};
				Relationships: [
					{
						foreignKeyName: 'public_tickets_phase_fkey';
						columns: ['phase'];
						isOneToOne: false;
						referencedRelation: 'phases';
						referencedColumns: ['id'];
					}
				];
			};
			workplan_pricing: {
				Row: {
					phase: string | null;
					price: number;
					proposal: string;
					ticket: string | null;
				};
				Insert: {
					phase?: string | null;
					price: number;
					proposal: string;
					ticket?: string | null;
				};
				Update: {
					phase?: string | null;
					price?: number;
					proposal?: string;
					ticket?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_workplan_pricing_phase_fkey';
						columns: ['phase'];
						isOneToOne: false;
						referencedRelation: 'phases';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_workplan_pricing_price_fkey';
						columns: ['price'];
						isOneToOne: false;
						referencedRelation: 'pricing';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_workplan_pricing_proposal_fkey';
						columns: ['proposal'];
						isOneToOne: false;
						referencedRelation: 'proposals';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_workplan_pricing_ticket_fkey';
						columns: ['ticket'];
						isOneToOne: false;
						referencedRelation: 'tickets';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			get_organization_from_phase: {
				Args: {
					phase_id: string;
				};
				Returns: {
					id: string;
					name: string;
					labor_rate: number;
					slug: string;
					default_template: number;
					visibility_settings: Json;
				}[];
			};
			is_organization_member: {
				Args: {
					organization_id: string;
					user_id: string;
				};
				Returns: boolean;
			};
			slugify: {
				Args: {
					value: string;
				};
				Returns: string;
			};
			unaccent: {
				Args: {
					'': string;
				};
				Returns: string;
			};
			unaccent_init: {
				Args: {
					'': unknown;
				};
				Returns: unknown;
			};
		};
		Enums: {
			auth_type: 'OAuth2';
			integration_type: 'reseller' | 'distribution';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

export type Tables<
	PublicTableNameOrOptions extends keyof (Database['public']['Tables'] & Database['public']['Views']) | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database['public']['Tables'] & Database['public']['Views'])
	? (Database['public']['Tables'] & Database['public']['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
	? Database['public']['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
	? Database['public']['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof Database['public']['Enums']
	? Database['public']['Enums'][PublicEnumNameOrOptions]
	: never;
