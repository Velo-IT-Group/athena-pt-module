import type { Database as DB } from '@/lib/database.types';

declare global {
	type Database = DB;
	type Organization = DB['public']['Tables']['organizations']['Row'];
	type Phase = DB['public']['Tables']['phases']['Row'];
	type Profile = DB['public']['Tables']['profiles']['Row'];
	type Proposal = DB['public']['Tables']['proposals']['Row'];
	type ProposalInsert = DB['public']['Tables']['proposals']['Insert'];
	type Task = DB['public']['Tables']['tasks']['Row'];
	type Ticket = DB['public']['Tables']['tickets']['Row'];
	type DoublyNestedProposal = Proposal & { phases: Array<NestedProposal> };
	type NestedProposal = Proposal & { phases: Array<Phase> };
	type NestedPhase = Phase & { tickets: Array<Ticket> };
}
