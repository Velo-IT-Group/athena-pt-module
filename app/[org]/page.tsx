import React, { Suspense } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { getOrganization, getTemplates, getUsers } from '@/lib/functions/read';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import OrganizationLayout from './organization-layout';
import { cookies } from 'next/headers';
import SortSelector from './sort-selector';
import Search from '@/components/Search';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import NewProposalForm from '@/components/forms/NewProposalForm';
import { createProposal } from '@/lib/functions/create';
import SubmitButton from '@/components/SubmitButton';
import UserSelector from './user-selector';
import { getTicket, getTickets } from '@/utils/manage/read';
import ProposalList from './proposal-list';
import CardSkeleton from '@/components/CardSkeleton';

type Props = {
	params: { org: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	// fetch data
	const organization = await getOrganization();
	return {
		title: `Quotes - ${organization?.name ?? 'Unknown'}`,
	};
}

const OverviewPage = async ({ params, searchParams }: Props) => {
	const [templates, tickets, organization, users] = await Promise.all([
		getTemplates(),
		getTickets(),
		getOrganization(),
		getUsers(),
	]);
	const cookieStore = cookies();
	const searchText = typeof searchParams.search === 'string' ? String(searchParams.search) : undefined;
	const homeSort = cookieStore.get('homeSort');
	const myProposalsCookie = cookieStore.get('myProposals');
	const myProposalsArray: string[] = myProposalsCookie?.value ? JSON.parse(myProposalsCookie?.value) : [];
	const myProposalsValues: string[] = Array.from(myProposalsArray);

	const action = async (data: FormData) => {
		'use server';
		const name = data.get('name') as string;
		const templates_used = parseInt(data.get('templates_used') as string) as number;
		const service_ticket = data.get('service_ticket') as unknown as number;
		const ticket = await getTicket(service_ticket, ['id', 'company', 'contact']);

		await createProposal({
			name,
			templates_used:
				templates_used && organization.default_template
					? [templates_used, organization?.default_template]
					: [organization!.default_template!],
			service_ticket: service_ticket,
			contact_id: ticket.contact?.id,
			company_id: ticket.company?.id,
			company_name: ticket.company?.name ?? undefined,
		});
	};

	return (
		<OrganizationLayout org={params.org}>
			<div className='grow flex-1 px-6 py-4 w-full space-y-4 flex flex-col'>
				<div className='flex gap-4 items-center w-full'>
					<Search
						baseUrl={`/${params.org}`}
						placeholder='Search quotes'
					/>

					<UserSelector
						defaultValue={myProposalsValues}
						users={users as Member[]}
					/>

					<SortSelector defaultValue={homeSort?.value} />

					<Dialog>
						<DialogTrigger asChild>
							<Button>
								<PlusIcon className='w-4 h-4 mr-2' /> Add New
							</Button>
						</DialogTrigger>

						<DialogContent>
							<DialogHeader>
								<DialogTitle>New Proposal</DialogTitle>
							</DialogHeader>

							<form action={action}>
								<NewProposalForm
									templates={templates ?? []}
									tickets={tickets ?? []}
								/>

								<DialogFooter className='justify-between w-full flex-row mt-4'>
									<DialogClose asChild>
										<Button
											type='button'
											variant='secondary'
										>
											Close
										</Button>
									</DialogClose>
									<SubmitButton>Submit</SubmitButton>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>

				<Suspense
					fallback={
						<>
							{new Array(9).fill(null).map((_, index) => (
								<CardSkeleton key={index} />
							))}
						</>
					}
				>
					<ProposalList
						params={params}
						sortValue={homeSort?.value as keyof Proposal}
						searchText={searchText}
						userFilters={myProposalsValues}
					/>
				</Suspense>
			</div>
		</OrganizationLayout>
	);
};

export default OverviewPage;
