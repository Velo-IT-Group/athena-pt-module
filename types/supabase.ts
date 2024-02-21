export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			organizations: {
				Row: {
					id: string;
					labor_rate: number;
					name: string;
				};
				Insert: {
					id?: string;
					labor_rate: number;
					name: string;
				};
				Update: {
					id?: string;
					labor_rate?: number;
					name?: string;
				};
				Relationships: [];
			};
			phases: {
				Row: {
					description: string;
					hours: number;
					id: string;
					order: number;
					section: string;
				};
				Insert: {
					description: string;
					hours?: number;
					id?: string;
					order?: number;
					section: string;
				};
				Update: {
					description?: string;
					hours?: number;
					id?: string;
					order?: number;
					section?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'public_phases_section_fkey';
						columns: ['section'];
						isOneToOne: false;
						referencedRelation: 'sections';
						referencedColumns: ['id'];
					}
				];
			};
			products: {
				Row: {
					catalog_item_id: number | null;
					extended_price: number;
					id: string;
					price: number | null;
					proposal: string;
					quantity: number;
				};
				Insert: {
					catalog_item_id?: number | null;
					extended_price: number;
					id?: string;
					price?: number | null;
					proposal: string;
					quantity?: number;
				};
				Update: {
					catalog_item_id?: number | null;
					extended_price?: number;
					id?: string;
					price?: number | null;
					proposal?: string;
					quantity?: number;
				};
				Relationships: [
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
			sections: {
				Row: {
					created_at: string;
					hours: number;
					id: string;
					name: string;
					order: number;
					proposal: string;
				};
				Insert: {
					created_at?: string;
					hours?: number;
					id?: string;
					name: string;
					order?: number;
					proposal: string;
				};
				Update: {
					created_at?: string;
					hours?: number;
					id?: string;
					name?: string;
					order?: number;
					proposal?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'public_sections_proposal_fkey';
						columns: ['proposal'];
						isOneToOne: false;
						referencedRelation: 'proposals';
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
				};
				Insert: {
					created_at?: string;
					id?: string;
					notes: string;
					priority: number;
					summary: string;
					ticket: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					notes?: string;
					priority?: number;
					summary?: string;
					ticket?: string;
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
				};
				Insert: {
					budget_hours?: number;
					created_at?: string;
					id?: string;
					order?: number;
					phase: string;
					summary: string;
				};
				Update: {
					budget_hours?: number;
					created_at?: string;
					id?: string;
					order?: number;
					phase?: string;
					summary?: string;
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
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
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
