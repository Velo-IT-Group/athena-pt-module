import React from 'react';
import { ProjectTemplate, ProjectWorkPlan } from '@/types';
import ProposalBuilder from '@/components/ProposalBuilder';
import ProposalTotalCard from '@/components/ProposalTotalCard';
import TemplatePicker from '@/components/TemplatePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import createSupabaseServerClient from '@/lib/supabase/server';

type Props = {
	params: { id: string };
};

const ProposalIdPage = async ({ params }: Props) => {
	const templateResult = await fetch(`http://localhost:3000/api/templates/`);
	const res = await fetch(`http://localhost:3000/api/templates/93/workplan`);
	const supabase = await createSupabaseServerClient();
	const { data: proposal, error } = await supabase
		.from('proposals')
		.select('*, phases(*, tickets(*))')
		.eq('id', params.id)
		.order('order', { referencedTable: 'phases', ascending: true })
		.single();

	if (!proposal || error) {
		return <div></div>;
	}
	const workPlan: ProjectWorkPlan = await res.json();
	const templates: Array<ProjectTemplate> = await templateResult.json();

	return (
		<div className='grid grid-cols-4 gap-4 items-start'>
			<div className='col-span-3 space-y-4'>
				<h1 className='text-xl font-semibold'>{proposal.name}</h1>
				<ProposalBuilder phases={proposal.phases} />
			</div>

			<div className='space-y-4'>
				<Card className='h-auto'>
					<Collapsible>
						<CollapsibleTrigger>
							<CardHeader>
								<CardTitle>Templates</CardTitle>
							</CardHeader>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<CardContent>
								<TemplatePicker templates={templates} />
							</CardContent>
						</CollapsibleContent>
					</Collapsible>
				</Card>
				<ProposalTotalCard proposal={proposal} />
			</div>
		</div>
	);
};

export default ProposalIdPage;
