import React from 'react';
import Navbar, { Tab } from '@/components/Navbar';
import { getMembers, getProducts, getProposal } from '@/lib/functions/read';
import { getCurrencyString } from '@/utils/money';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import ProposalActions from './proposal-actions';
import { ProposalShare } from './proposal-share';
import { calculateTotals } from '@/utils/helpers';

type Props = {
	params: { org: string; id: string };
	children: React.ReactNode;
};

const ProposalIdLayout = async ({ params, children }: Props) => {
	const { id, org } = params;

	const proposal = await getProposal(id);
	const products = await getProducts(id);
	const members = await getMembers();
	if (!proposal) return notFound();

	const tabs: Tab[] = [
		{ name: 'Overview', href: `/${org}/proposal/${id}` },
		{ name: 'Workplan', href: `/${org}/proposal/${id}/workplan` },
		{ name: 'Products', href: `/${org}/proposal/${id}/products` },
		{ name: 'Settings', href: `/${org}/proposal/${id}/settings` },
	];

	const { laborTotal, productTotal, recurringTotal, totalPrice } = calculateTotals(products, proposal.phases, proposal.labor_rate);
	return (
		<>
			<Navbar org={org} title={proposal?.name} tabs={tabs}>
				<HoverCard>
					<HoverCardTrigger asChild>
						<Button variant='link' className='text-sm font-medium'>
							<span>
								Total: <span className='text-muted-foreground'>{getCurrencyString(totalPrice)}</span>
							</span>
						</Button>
					</HoverCardTrigger>
					<HoverCardContent className='w-80'>
						<div className='grid gap-4'>
							<div className='space-y-2'>
								<h4 className='font-medium leading-none'>Totals</h4>
								<p className='text-sm text-muted-foreground'>See the totals of the different aspects of the proposal.</p>
							</div>
							<div className='grid gap-2'>
								<div className='grid grid-cols-3 items-center gap-4'>
									<Label>Labor Total</Label>
									<p className='col-span-2 h-8 text-sm'>
										{getCurrencyString(
											proposal.phases.reduce((accumulator, currentValue) => accumulator + (currentValue?.hours ?? 0) * proposal.labor_rate, 0) ?? 0
										)}
									</p>
								</div>
								<div className='grid grid-cols-3 items-center gap-4'>
									<Label>Product Total</Label>
									<p className='col-span-2 h-8 text-sm'>
										{getCurrencyString(products.reduce((accumulator, currentValue) => accumulator + (currentValue?.price ?? 0), 0) ?? 0)}
									</p>
								</div>
								<div className='grid grid-cols-3 items-center gap-4'>
									<Label>Recurring</Label>
									<p className='col-span-2 h-8 text-sm'>{getCurrencyString(recurringTotal)}</p>
								</div>
							</div>
						</div>
					</HoverCardContent>
					<ProposalShare proposalId={proposal.id} />
					<ProposalActions
						proposal={proposal}
						phases={proposal.phases}
						tickets={proposal.phases.map((p) => p.tickets).flat()}
						tasks={proposal.phases.map((p) => p.tickets.map((t) => t.tasks).flat()).flat()}
					/>
				</HoverCard>
			</Navbar>
			{/* <span className='text-muted-foreground text-xs animate-in fade-in truncate pb-2 capitalize'>
				Last updated {relativeDate(new Date(proposal.updated_at))}
			</span> */}
			<div className='min-h-header light:bg-muted/50 flex flex-col'>{children}</div>
		</>
	);
};

export default ProposalIdLayout;
