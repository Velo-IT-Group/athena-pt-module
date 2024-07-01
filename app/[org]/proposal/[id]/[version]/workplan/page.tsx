import { getPhases, getProposal, getTemplates, getVersions } from '@/lib/functions/read';
import ProposalBuilder from './ProposalBuilder';

import React from 'react';

type Props = {
	params: { id: string; version: string };
};

const ProposalWorkplanPage = async ({ params }: Props) => {
	const phases = await getPhases(params.version);
	const templates = await getTemplates();

	if (!phases) return <div></div>;

	return (
		<main className='min-h-header bg-background'>
			<ProposalBuilder
				phases={phases ?? []}
				templates={templates ?? []}
				id={params.id}
				version={params.version}
			/>
		</main>
	);
};

export default ProposalWorkplanPage;
