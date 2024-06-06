import React from 'react';
import Navbar, { Tab } from '@/components/Navbar';
import { getProposal, getTicket, getVersions } from '@/lib/functions/read';
import { getCurrencyString } from '@/utils/money';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import ProposalActions from './(proposal_id)/proposal-actions';
import { ProposalShare } from './(proposal_id)/proposal-share';
import { calculateTotals } from '@/utils/helpers';
import { Metadata, ResolvingMetadata } from 'next';
import { Separator } from '@/components/ui/separator';

type Props = {
	params: { org: string; id: string; version: string };
	children: React.ReactNode;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	const { id, version } = params;
	const proposal = await getProposal(id, version);
	return {
		title: proposal?.name,
	};
}

const ProposalIdLayout = async ({ params, children }: Props) => {
	const { id, org, version } = params;
	const proposal = await getProposal(id, version);

	if (!proposal) return notFound();

	const versions = await getVersions(proposal.id);

	const tabs: Tab[] = [
		{ name: 'Overview', href: `/${org}/proposal/${id}/${version}` },
		{ name: 'Workplan', href: `/${org}/proposal/${id}/${version}/workplan` },
		{ name: 'Products', href: `/${org}/proposal/${id}/${version}/products` },
		{ name: 'Settings', href: `/${org}/proposal/${id}/${version}/settings` },
	];

	const serviceTicket = await getTicket(proposal.service_ticket ?? 0);

	if (!serviceTicket) {
		notFound();
	}

	// console.log(proposal.working_version);

	const { laborTotal, productTotal, recurringTotal, totalPrice, recurringCost, productCost } = calculateTotals(
		proposal.working_version.sections.flatMap((s) => s.products),
		proposal.working_version.phases,
		proposal.labor_rate
	);

	return (
		<>
			<Navbar
				org={org}
				title={proposal?.name}
				titleId={id}
				version={proposal.versions.length > 1 && proposal.working_version.number ? proposal.working_version.number : undefined}
				tabs={tabs}
			>
				<HoverCard>
					<HoverCardTrigger asChild>
						<Button variant='link' className='text-sm font-medium'>
							<span>
								Total: <span className='text-muted-foreground'>{getCurrencyString(totalPrice)}</span>
							</span>
						</Button>
					</HoverCardTrigger>

					<HoverCardContent className='w-80'>
						<div className='grid gap-2'>
							<div className='space-y-2'>
								<h4 className='font-medium leading-none'>Totals</h4>
								<Separator />
							</div>

							<div className='grid gap-2'>
								<div className='grid grid-cols-5 items-center gap-2'>
									<Label className='col-span-2'>Labor</Label>
									<p className='col-span-3 text-sm'>{getCurrencyString(laborTotal)}</p>
								</div>

								<div className='grid grid-cols-5 items-center gap-2'>
									<Label className='col-span-2'>Product</Label>
									<p className='col-span-3 text-sm'>{getCurrencyString(productTotal)}</p>
								</div>

								<div className='grid grid-cols-5 items-center gap-2'>
									<Label className='col-span-2'>Recurring</Label>
									<p className='col-span-3 text-sm'>{getCurrencyString(recurringTotal)}</p>
								</div>

								<div className='grid grid-cols-5 items-center gap-2'>
									<Label className='col-span-2'>Cost</Label>
									<p className='col-span-3 text-sm'>{getCurrencyString(productCost)}</p>
								</div>

								<div className='grid grid-cols-5 items-center gap-2'>
									<Label className='col-span-2'>Recurring Cost</Label>
									<p className='col-span-3 text-sm'>{getCurrencyString(recurringCost)}</p>
								</div>
							</div>
						</div>
					</HoverCardContent>

					<ProposalShare proposalId={proposal.id} versionId={version} />

					<ProposalActions
						proposal={proposal}
						phases={proposal.working_version.phases ?? []}
						tickets={proposal.working_version?.phases?.map((p) => p.tickets ?? [])?.flat() ?? []}
						ticket={serviceTicket}
						versions={versions}
						params={params}
					/>
				</HoverCard>
			</Navbar>

			<div className='min-h-header light:bg-muted/50 flex flex-col'>{children}</div>
		</>
	);
};

export default ProposalIdLayout;
