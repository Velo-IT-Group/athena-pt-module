export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			activity_log: {
				Row: {
					event_timestamp: string;
					event_type: string | null;
					id: number;
					row_data: Json | null;
					table_name: string | null;
					user: string | null;
				};
				Insert: {
					event_timestamp?: string;
					event_type?: string | null;
					id?: number;
					row_data?: Json | null;
					table_name?: string | null;
					user?: string | null;
				};
				Update: {
					event_timestamp?: string;
					event_type?: string | null;
					id?: number;
					row_data?: Json | null;
					table_name?: string | null;
					user?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_activity_log_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			comments: {
				Row: {
					id: string;
					phase: string | null;
					proposal: string;
					sent_at: string;
					text: string;
					ticket: string | null;
					user: string | null;
				};
				Insert: {
					id?: string;
					phase?: string | null;
					proposal: string;
					sent_at?: string;
					text: string;
					ticket?: string | null;
					user?: string | null;
				};
				Update: {
					id?: string;
					phase?: string | null;
					proposal?: string;
					sent_at?: string;
					text?: string;
					ticket?: string | null;
					user?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_comments_phase_fkey';
						columns: ['phase'];
						isOneToOne: false;
						referencedRelation: 'phases';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_comments_proposal_fkey';
						columns: ['proposal'];
						isOneToOne: false;
						referencedRelation: 'proposals';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_comments_ticket_fkey';
						columns: ['ticket'];
						isOneToOne: false;
						referencedRelation: 'tickets';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'public_comments_user_fkey';
						columns: ['user'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
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
					secret_key: string | null;
				};
				Insert: {
					client_id?: string | null;
					integration: string;
					organization: string;
					secret_key?: string | null;
				};
				Update: {
					client_id?: string | null;
					integration?: string;
					organization?: string;
					secret_key?: string | null;
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
					calculated_cost: number | null;
					calculated_cost_flag: boolean | null;
					calculated_price: number | null;
					calculated_price_flag: boolean | null;
					catalog_item: number | null;
					category: string | null;
					cost: number | null;
					created_at: string | null;
					customer_description: string | null;
					description: string | null;
					drop_ship_flag: boolean | null;
					hide_description_flag: boolean | null;
					hide_extended_price_flag: boolean | null;
					hide_item_identifier_flag: boolean | null;
					hide_price_flag: boolean | null;
					hide_quantity_flag: boolean | null;
					id: number | null;
					identifier: string | null;
					inactive_flag: boolean | null;
					manufacturer: string | null;
					manufacturer_part_number: string | null;
					parent: string | null;
					parent_catalog_item: number | null;
					phase_product_flag: boolean | null;
					price: number | null;
					product_class: string | null;
					proposal: string | null;
					quantity: number;
					recurring_bill_cycle: number | null;
					recurring_cost: number | null;
					recurring_cycle_type: string | null;
					recurring_flag: boolean | null;
					recurring_one_time_flag: boolean | null;
					recurring_revenue: number | null;
					sequence_number: number | null;
					serialized_cost_flag: boolean | null;
					serialized_flag: boolean | null;
					special_order_flag: boolean | null;
					subcategory: string | null;
					taxable_flag: boolean | null;
					type: string | null;
					unique_id: string;
					unit_of_measure: string | null;
					vendor: string | null;
				};
				Insert: {
					calculated_cost?: number | null;
					calculated_cost_flag?: boolean | null;
					calculated_price?: number | null;
					calculated_price_flag?: boolean | null;
					catalog_item?: number | null;
					category?: string | null;
					cost?: number | null;
					created_at?: string | null;
					customer_description?: string | null;
					description?: string | null;
					drop_ship_flag?: boolean | null;
					hide_description_flag?: boolean | null;
					hide_extended_price_flag?: boolean | null;
					hide_item_identifier_flag?: boolean | null;
					hide_price_flag?: boolean | null;
					hide_quantity_flag?: boolean | null;
					id?: number | null;
					identifier?: string | null;
					inactive_flag?: boolean | null;
					manufacturer?: string | null;
					manufacturer_part_number?: string | null;
					parent?: string | null;
					parent_catalog_item?: number | null;
					phase_product_flag?: boolean | null;
					price?: number | null;
					product_class?: string | null;
					proposal?: string | null;
					quantity?: number;
					recurring_bill_cycle?: number | null;
					recurring_cost?: number | null;
					recurring_cycle_type?: string | null;
					recurring_flag?: boolean | null;
					recurring_one_time_flag?: boolean | null;
					recurring_revenue?: number | null;
					sequence_number?: number | null;
					serialized_cost_flag?: boolean | null;
					serialized_flag?: boolean | null;
					special_order_flag?: boolean | null;
					subcategory?: string | null;
					taxable_flag?: boolean | null;
					type?: string | null;
					unique_id?: string;
					unit_of_measure?: string | null;
					vendor?: string | null;
				};
				Update: {
					calculated_cost?: number | null;
					calculated_cost_flag?: boolean | null;
					calculated_price?: number | null;
					calculated_price_flag?: boolean | null;
					catalog_item?: number | null;
					category?: string | null;
					cost?: number | null;
					created_at?: string | null;
					customer_description?: string | null;
					description?: string | null;
					drop_ship_flag?: boolean | null;
					hide_description_flag?: boolean | null;
					hide_extended_price_flag?: boolean | null;
					hide_item_identifier_flag?: boolean | null;
					hide_price_flag?: boolean | null;
					hide_quantity_flag?: boolean | null;
					id?: number | null;
					identifier?: string | null;
					inactive_flag?: boolean | null;
					manufacturer?: string | null;
					manufacturer_part_number?: string | null;
					parent?: string | null;
					parent_catalog_item?: number | null;
					phase_product_flag?: boolean | null;
					price?: number | null;
					product_class?: string | null;
					proposal?: string | null;
					quantity?: number;
					recurring_bill_cycle?: number | null;
					recurring_cost?: number | null;
					recurring_cycle_type?: string | null;
					recurring_flag?: boolean | null;
					recurring_one_time_flag?: boolean | null;
					recurring_revenue?: number | null;
					sequence_number?: number | null;
					serialized_cost_flag?: boolean | null;
					serialized_flag?: boolean | null;
					special_order_flag?: boolean | null;
					subcategory?: string | null;
					taxable_flag?: boolean | null;
					type?: string | null;
					unique_id?: string;
					unit_of_measure?: string | null;
					vendor?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_products_2_parent_fkey';
						columns: ['parent'];
						isOneToOne: false;
						referencedRelation: 'products';
						referencedColumns: ['unique_id'];
					},
					{
						foreignKeyName: 'public_products_2_proposal_fkey';
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
					expiration_date: string | null;
					hours_required: number | null;
					id: string;
					labor_hours: number;
					labor_rate: number;
					management_hours: number;
					name: string;
					organization: string | null;
					sales_hours: number;
					service_ticket: number | null;
					status: Database['public']['Enums']['status'];
					templates_used: number[] | null;
					total_labor_price: number;
					total_price: number | null;
					total_product_price: number;
					updated_at: string;
				};
				Insert: {
					company_name?: string | null;
					created_at?: string;
					expiration_date?: string | null;
					hours_required?: number | null;
					id?: string;
					labor_hours?: number;
					labor_rate?: number;
					management_hours?: number;
					name: string;
					organization?: string | null;
					sales_hours?: number;
					service_ticket?: number | null;
					status?: Database['public']['Enums']['status'];
					templates_used?: number[] | null;
					total_labor_price?: number;
					total_price?: number | null;
					total_product_price?: number;
					updated_at?: string;
				};
				Update: {
					company_name?: string | null;
					created_at?: string;
					expiration_date?: string | null;
					hours_required?: number | null;
					id?: string;
					labor_hours?: number;
					labor_rate?: number;
					management_hours?: number;
					name?: string;
					organization?: string | null;
					sales_hours?: number;
					service_ticket?: number | null;
					status?: Database['public']['Enums']['status'];
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
			decrypted_organization_integrations: {
				Row: {
					client_id: string | null;
					decrypted_secret_key: string | null;
					integration: string | null;
					organization: string | null;
					secret_key: string | null;
				};
				Insert: {
					client_id?: string | null;
					decrypted_secret_key?: never;
					integration?: string | null;
					organization?: string | null;
					secret_key?: string | null;
				};
				Update: {
					client_id?: string | null;
					decrypted_secret_key?: never;
					integration?: string | null;
					organization?: string | null;
					secret_key?: string | null;
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
		};
		Functions: {
			duplicate_phases: {
				Args: {
					original_id: string;
					new_id: string;
				};
				Returns: undefined;
			};
			duplicate_products: {
				Args: {
					original_id: string;
					new_id: string;
				};
				Returns: undefined;
			};
			duplicate_tasks: {
				Args: {
					original_id: string;
					new_id: string;
				};
				Returns: undefined;
			};
			duplicate_tickets: {
				Args: {
					original_id: string;
					new_id: string;
				};
				Returns: undefined;
			};
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
			jsonb_diff_val: {
				Args: {
					val1: Json;
					val2: Json;
				};
				Returns: Json;
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
			integration_type: 'reseller' | 'distribution' | 'email';
			status: 'building' | 'inProgress' | 'signed' | 'canceled';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
	? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
	? PublicSchema['Enums'][PublicEnumNameOrOptions]
	: never;
