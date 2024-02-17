import ProposalBuilder from '@/components/ProposalBuilder';
import { getProposal, getTemplates } from '@/lib/data';
import React from 'react';

type Props = {
	params: { id: string };
};

const ProposalWorkplanPage = async ({ params }: Props) => {
	const proposal = await getProposal(params.id);
	const templates = await getTemplates();

	if (!proposal) return <div></div>;

	const { sections } = proposal;

	return (
		<div className='w-full h-full'>
			<ProposalBuilder id={params.id} sections={sections} templates={templates ?? []} />
		</div>
	);
};

export default ProposalWorkplanPage;