import React from 'react';
import { getProducts, getProposal } from '@/lib/functions/read';
import { getCatalogItems } from '@/utils/manage/read';
import ProductsList from './products-list';
import SectionTabs from './section-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CatalogPicker from './catalog-picker';

type Props = {
	params: { org: string; id: string; version: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

const ProposalProductPage = async ({ params, searchParams }: Props) => {
	const search = typeof searchParams.search === 'string' ? String(searchParams.search) : undefined;
	const identifier = typeof searchParams.identifier === 'string' ? String(searchParams.identifier) : undefined;
	const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
	const { catalogItems, count } = await getCatalogItems(search, identifier, page);
	const proposal = await getProposal(params.id, params.version);
	const products = await getProducts(params.version);

	if (!proposal) {
		return <div></div>;
	}

	return (
		<main className='grow px-6 py-4 w-full space-y-4 flex flex-col theme-zinc bg-muted/40'>
			<header className='flex items-center justify-between'>
				<SectionTabs sections={proposal.working_version.sections ?? []} version={proposal.working_version.id} params={params} />

				<CatalogPicker proposal={proposal.id} catalogItems={catalogItems} count={count} page={page} params={params} />
			</header>

			<section>
				<Card>
					<CardHeader>
						<CardTitle>All Products</CardTitle>
						<CardDescription>Manage your products and view their sales performance.</CardDescription>
					</CardHeader>
					<CardContent>
						<ProductsList products={products} proposal={params.id} catalogItems={catalogItems} count={count} page={page} params={params} />
					</CardContent>
				</Card>
			</section>
		</main>
	);
};

export default ProposalProductPage;
