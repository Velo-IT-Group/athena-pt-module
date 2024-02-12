import React from 'react';
import { getPhases, getProposal, getTemplates } from '@/lib/data';
import Proposal from '@/components/Proposal';

type Props = {
	params: { id: string };
};

const ProposalIdPage = async ({ params }: Props) => {
	const { id } = params;
	const proposal = await getProposal(id);
	const templates = await getTemplates();
	const phases = await getPhases(id);

	if (!!!proposal || !templates || !phases) {
		return <div></div>;
	}

	return (
		<Proposal phases={phases} proposal={proposal} templates={templates} />

		// <DragDropContext
		// 	onDragEnd={(result) => {
		// 		console.log(result);
		// 	}}
		// >
		// 	<div className='col-span-4 space-y-4'>
		// 		<ProposalBuilder id={proposal.id} phases={phases ?? []} />
		// 	</div>

		// 	<div className='space-y-4'>
		// 		<TemplatePicker templates={templates} templates_used={proposal.templates_used} />
		// 		<ProposalTotalCard proposal={proposal} />
		// 	</div>
		// </DragDropContext>
	);
};

export default ProposalIdPage;
