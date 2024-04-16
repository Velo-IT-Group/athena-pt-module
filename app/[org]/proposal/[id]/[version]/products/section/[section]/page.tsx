import React from 'react';
import SectionTabs from '../../section-tabs';
import CatalogPicker from '../../catalog-picker';
import { cookies } from 'next/headers';
import { getProposal, getSection } from '@/lib/functions/read';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductsList from '../../products-list';
import { getCatalogItems } from '@/utils/manage/read';

type Props = {
	params: { org: string; id: string; version: string; section: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async ({ params, searchParams }: Props) => {
	const search = typeof searchParams.search === 'string' ? String(searchParams.search) : undefined;
	const identifier = typeof searchParams.identifier === 'string' ? String(searchParams.identifier) : undefined;
	const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
	const { catalogItems, count } = await getCatalogItems(search, identifier, page);
	const proposal = await getProposal(params.id, params.version);
	const section = await getSection(params.section);

	const baseUrl = `/${params.org}/proposal/${params.id}/${params.version}/products/section/${params.section}`;

	if (!proposal) {
		return <div></div>;
	}

	return (
		<main className='grow px-6 py-4 w-full space-y-4 flex flex-col theme-zinc bg-muted/40'>
			<header className='flex items-center justify-between'>
				<SectionTabs sections={proposal.working_version.sections ?? []} version={proposal.working_version.id} params={params} />

				<CatalogPicker
					proposal={proposal.id}
					catalogItems={catalogItems}
					count={count}
					page={page}
					params={params}
					section={section.id}
					url={baseUrl}
				/>
			</header>

			<section>
				<Card>
					<CardHeader>
						<CardTitle>{section.name}</CardTitle>
						<CardDescription>Manage the products in the {section.name} section.</CardDescription>
					</CardHeader>
					<CardContent>
						<ProductsList
							products={section?.products ?? []}
							proposal={params.id}
							catalogItems={catalogItems}
							count={count}
							page={page}
							params={params}
						/>
					</CardContent>
				</Card>
			</section>
		</main>
	);
};

export default Page;
