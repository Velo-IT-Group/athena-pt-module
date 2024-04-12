import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { getOrganization, getProposals, getTemplates, getTickets } from '@/lib/functions/read';
import { Button } from '@/components/ui/button';
import { FileTextIcon, PlusIcon } from '@radix-ui/react-icons';
import { notFound } from 'next/navigation';
import OrganizationLayout from './organization-layout';
import { cookies } from 'next/headers';
import SortSelector from './sort-selector';
import Search from '@/components/Search';
import { ProposalCard } from './proposal-card/index';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NewProposalForm from '@/components/forms/NewProposalForm';
import { createProposal } from '@/lib/functions/create';
import SubmitButton from '@/components/SubmitButton';
import { cn } from '@/lib/utils';

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
	const [templates, tickets, organization] = await Promise.all([getTemplates(), getTickets(), getOrganization()]);
	const cookieStore = cookies();
	const searchText = typeof searchParams.search === 'string' ? String(searchParams.search) : undefined;
	const homeSort = cookieStore.get('homeSort');
	const proposals = await getProposals(homeSort?.value as keyof Proposal, searchText);

	if (!proposals) {
		notFound();
	}

	if (!proposals) return <div></div>;

	const action = async (data: FormData) => {
		'use server';
		const name = data.get('name') as string;
		const templates_used = parseInt(data.get('templates_used') as string) as unknown as number;
		const service_ticket = data.get('service_ticket') as unknown as number;
		console.log(name, templates_used ? [templates_used, organization?.default_template] : [organization?.default_template], service_ticket);

		await createProposal({
			name,
			// @ts-ignore
			templates_used: templates_used ? [templates_used, organization?.default_template] : [organization?.default_template],
			service_ticket: service_ticket,
		});
	};

	return (
		<OrganizationLayout org={params.org}>
			<div className='grow flex-1 px-6 py-4 w-full space-y-4 flex flex-col'>
				<form method='GET' className='flex gap-4 items-center w-full'>
					<Search baseUrl={`/${params.org}`} placeholder='Search quotes' />

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

							<form id='proposal-creation' name='proposal-creation' action={action}>
								<NewProposalForm templates={templates ?? []} tickets={tickets ?? []} />

								<DialogFooter className='justify-between w-full flex-row mt-6'>
									<DialogClose asChild>
										<Button type='button' variant='secondary'>
											Close
										</Button>
									</DialogClose>
									<SubmitButton>Submit</SubmitButton>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</form>

				<div className={cn('grid gap-4', !proposals.length && 'grow')} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
					{proposals.length ? (
						proposals.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} orgId={params.org} />)
					) : (
						<div className='grow flex-1 flex flex-col items-center justify-center space-y-2'>
							<FileTextIcon className='w-6 h-6' />
							<h2 className='text-lg font-semibold'> No quotes have been created.</h2>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant='secondary'>
										<PlusIcon className='w-4 h-4 mr-2' /> Create one
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>New Proposal</DialogTitle>
									</DialogHeader>
									<form id='proposal-creation' name='proposal-creation' action={action}>
										<NewProposalForm templates={templates ?? []} tickets={tickets ?? []} />
										<DialogFooter className='justify-between w-full flex-row mt-6'>
											<DialogClose asChild>
												<Button type='button' variant='secondary'>
													Close
												</Button>
											</DialogClose>
											<SubmitButton>Submit</SubmitButton>
										</DialogFooter>
									</form>
								</DialogContent>
							</Dialog>
						</div>
					)}
				</div>
			</div>
		</OrganizationLayout>
	);
};

export default OverviewPage;
