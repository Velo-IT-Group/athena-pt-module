import type { Database as DB, Tables } from '@/types/supabase';
import { Tables } from '@/types/supabase';

declare global {
	type Database = DB;

	type Integration = DB['public']['Tables']['integrations']['Row'];

	type Organization = DB['public']['Tables']['organizations']['Row'];
	type OrganizationUpdate = DB['public']['Tables']['organizations']['Update'];
	type OrganizationInsert = DB['public']['Tables']['organizations']['Insert'];
	type OrganizationIntegrationInsert = DB['public']['Tables']['organization_integrations']['Insert'];
	type OrganizationIntegrationUpdate = DB['public']['Tables']['organization_integrations']['Update'];
	type OrganizationIntegration = DB['public']['Tables']['organization_integrations']['Row'];

	type Member = DB['public']['Tables']['profiles']['Row'];

	type ProposalSettings = DB['public']['Tables']['proposal_settings']['Row'];
	type ProposalSettingsUpdate = DB['public']['Tables']['proposal_settings']['Update'];
	type ProposalSettingsInsert = DB['public']['Tables']['proposal_settings']['Insert'];

	type Phase = DB['public']['Tables']['phases']['Row'];
	type PhaseInsert = DB['public']['Tables']['phases']['Insert'];
	type PhaseUpdate = DB['public']['Tables']['phases']['Update'];

	type Product = DB['public']['Tables']['products']['Row'];
	type ProductInsert = DB['public']['Tables']['products']['Insert'];
	type ProductUpdate = DB['public']['Tables']['products']['Update'];
	type NestedProduct = Product & { products?: Product[] };

	type Profile = DB['public']['Tables']['profiles']['Row'];

	type Proposal = DB['public']['Tables']['proposals']['Row'];
	type ProposalUpdate = DB['public']['Tables']['proposals']['Update'];
	type ProposalInsert = DB['public']['Tables']['proposals']['Insert'];

	type Section = DB['public']['Tables']['sections']['Row'];
	type SectionInsert = DB['public']['Tables']['sections']['Insert'];
	type SectionUpdate = DB['public']['Tables']['sections']['Update'];

	type Task = DB['public']['Tables']['tasks']['Row'];
	type TaskInsert = DB['public']['Tables']['tasks']['Insert'];
	type TaskUpdate = DB['public']['Tables']['tasks']['Update'];

	type Ticket = DB['public']['Tables']['tickets']['Row'];
	type TicketInsert = DB['public']['Tables']['tickets']['Insert'];
	type TicketUpdate = DB['public']['Tables']['tickets']['Insert'];

	type Version = DB['public']['Tables']['versions']['Row'];
	type VersionInsert = DB['public']['Tables']['versions']['Insert'];
	type VersionUpdate = DB['public']['Tables']['versions']['Update'];

	type StatusEnum = DB['public']['Enums']['status'];

	type NestedProposal = Proposal & {
		working_version?: Version & {
			products: NestedProduct[];
			sections: Array<Section & { products: NestedProduct[] }>;
			phases: NestedPhase[];
		};
		phases?: Array<NestedPhase>;
		products?: NestedProduct[];
		sections?: Array<Section & { products?: NestedProduct[] }>;
	};
	type NestedProduct = Phase & { tickets?: Array<Ticket & { tasks?: Task[] }> };
	type NestedTicket = Ticket & { tasks?: Task[] };
	type NestedPhase = Phase & { tickets?: NestedTicket[] };
	type NestedSection = Section & { products?: NestedProduct[] };
}
