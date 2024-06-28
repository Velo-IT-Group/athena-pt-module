import React from 'react';
import { getProducts, getProposal, getSections } from '@/lib/functions/read';
import { getCatalogItems } from '@/utils/manage/read';
import SectionTabs from './section-tabs';

type Props = {
	params: { org: string; id: string; version: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

const ProposalProductPage = async ({ params, searchParams }: Props) => {
	const search = typeof searchParams.search === 'string' ? String(searchParams.search) : undefined;
	const identifier = typeof searchParams.identifier === 'string' ? String(searchParams.identifier) : undefined;
	const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;

	const [{ catalogItems, count }, proposal, sections] = await Promise.all([
		getCatalogItems(search, identifier, page),
		getProposal(params.id),
		getSections(params.version),
	]);

	if (!proposal) {
		return <div></div>;
	}

	return (
		<main className='grow px-6 py-4 w-full space-y-4 flex flex-col bg-muted/40'>
			<SectionTabs
				params={params}
				sections={sections}
				version={proposal.working_version.id}
				proposal={proposal.id}
				catalogItems={catalogItems}
				count={count}
				page={page}
			/>
		</main>
	);
};

export default ProposalProductPage;
