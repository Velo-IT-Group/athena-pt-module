import { getProposal, getTemplates, getVersions } from '@/lib/functions/read';
import ProposalBuilder from './ProposalBuilder';

import React from 'react';

type Props = {
	params: { id: string; version: string };
};

const ProposalWorkplanPage = async ({ params }: Props) => {
	const proposal = await getProposal(params.id, params.version);
	const templates = await getTemplates();

	if (!proposal) return <div></div>;

	return (
		<main className='min-h-header bg-background'>
			<ProposalBuilder phases={proposal?.working_version?.phases ?? []} templates={templates ?? []} id={params.id} version={params.version} />
		</main>
	);
};

export default ProposalWorkplanPage;
