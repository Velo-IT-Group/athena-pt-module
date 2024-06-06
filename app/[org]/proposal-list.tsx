import { getProposals } from '@/lib/functions/read';
import React from 'react';
import { ProposalCard } from './proposal-card';
import { FileTextIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

type Props = {
	sortValue?: keyof Proposal;
	searchText?: string;
	userFilters?: string[];
	params: { org: string };
};

const ProposalList = async ({ sortValue, searchText, userFilters = [], params }: Props) => {
	const proposals = await getProposals(sortValue, searchText, userFilters);

	return (
		<div
			className={cn('grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3', !proposals.length && 'grow')}
		>
			{proposals.length ? (
				proposals.map((proposal) => (
					<ProposalCard
						key={proposal.id}
						proposal={proposal}
						orgId={params.org}
					/>
				))
			) : (
				<div className='grow flex-1 flex flex-col items-center justify-center space-y-2 md:col-span-2 lg:col-span-3'>
					<FileTextIcon className='w-6 h-6' />

					<h2 className='text-lg font-semibold'> No quotes have been created.</h2>
				</div>
			)}
		</div>
	);
};

export default ProposalList;
