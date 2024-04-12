import React from 'react';
import { getCatalogItems, getProposal } from '@/lib/functions/read';
import ProductsList from './products-list';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import SectionTabs from './section-tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CatalogPicker from './catalog-picker';
import { cookies } from 'next/headers';

type Props = {
	params: { org: string; id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

const ProposalProductPage = async ({ params, searchParams }: Props) => {
	const selectedSection = cookies().get(`${params.id}:selected-section`);
	const search = typeof searchParams.search === 'string' ? String(searchParams.search) : undefined;
	const identifier = typeof searchParams.identifier === 'string' ? String(searchParams.identifier) : undefined;
	const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
	const { catalogItems, count } = await getCatalogItems(search, identifier, page);
	const proposal = await getProposal(params.id);

	if (!proposal) {
		return <div></div>;
	}

	return (
		<Tabs defaultValue='all' className='grow px-6 py-4 w-full space-y-4 flex flex-col theme-zinc bg-muted/40'>
			<div className='flex items-center justify-between'>
				<SectionTabs
					sections={proposal.working_version.sections ?? []}
					proposal={proposal.id}
					version={proposal.working_version.id}
					defaultTab={selectedSection?.value}
				/>

				<CatalogPicker
					proposal={proposal.id}
					version={proposal.working_version.id}
					catalogItems={catalogItems}
					count={count}
					page={page}
					params={params}
					section={selectedSection?.value}
				/>
			</div>

			<TabsContent value='all'>
				<Card>
					<CardHeader>
						<CardTitle>Products</CardTitle>
						<CardDescription>Manage your products and view their sales performance.</CardDescription>
					</CardHeader>
					<CardContent>
						<ProductsList
							products={proposal.working_version.products}
							proposal={params.id}
							catalogItems={catalogItems}
							count={count}
							page={page}
							params={params}
						/>
					</CardContent>
				</Card>
			</TabsContent>

			{proposal.working_version.sections &&
				proposal.working_version.sections?.length > 0 &&
				proposal.working_version.sections?.map((section) => {
					console.log(section);
					return (
						<TabsContent key={section.id} value={section.id}>
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
						</TabsContent>
					);
				})}
		</Tabs>
	);
};

export default ProposalProductPage;
