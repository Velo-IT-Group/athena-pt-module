import ProposalBuilder from './ProposalBuilder';
import { getProposal, getSections, getTemplates } from '@/lib/data';
import React from 'react';

type Props = {
	params: { id: string };
};

const ProposalWorkplanPage = async ({ params }: Props) => {
	const proposal = await getProposal(params.id);
	const sections = await getSections(params.id);
	const templates = await getTemplates();

	if (!proposal) return <div></div>;

	return <ProposalBuilder sections={sections ?? []} templates={templates ?? []} id={params.id} />;
};

export default ProposalWorkplanPage;
