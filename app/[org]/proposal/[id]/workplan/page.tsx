import { getProposal, getSections, getTemplates } from '@/lib/functions/read';
import ProposalBuilder from './ProposalBuilder';

import React from 'react';

type Props = {
	params: { id: string };
};

const ProposalWorkplanPage = async ({ params }: Props) => {
	const proposal = await getProposal(params.id);
	const sections = await getSections(params.id);
	const templates = await getTemplates();

	if (!proposal) return <div></div>;

	return (
		<main className='min-h-header bg-background'>
			<ProposalBuilder sections={sections ?? []} templates={templates ?? []} id={params.id} />
		</main>
	);
};

export default ProposalWorkplanPage;
