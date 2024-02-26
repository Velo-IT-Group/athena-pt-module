import React from 'react';
import Navbar, { Tab } from '@/components/Navbar';
import { getProposal } from '@/lib/functions/read';
import { getCurrencyString } from '@/utils/money';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ProposalDropdownMenu from '@/components/ProposalDropdownMenu';

type Props = {
	params: { org: string; id: string };
	children: React.ReactNode;
};

const ProposalIdLayout = async ({ params, children }: Props) => {
	const { id, org } = params;
	const proposal = await getProposal(id);

	if (!id) return <div></div>;

	const tabs: Tab[] = [
		{ name: 'Overview', href: `/${org}/proposal/${id}` },
		{ name: 'Workplan', href: `/${org}/proposal/${id}/workplan` },
		{ name: 'Products', href: `/${org}/proposal/${id}/products` },
		{ name: 'Settings', href: `/${org}/proposal/${id}/settings` },
	];

	return (
		<>
			<Navbar org={org} title={proposal?.name} tabs={tabs}>
				<HoverCard>
					<HoverCardTrigger asChild>
						<Button variant='link' className='text-sm font-medium'>
							<span className='text-muted-foreground'>Total: </span> {getCurrencyString(proposal?.total_price ?? 0)}
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
									<p className='col-span-2 h-8 text-sm'>{getCurrencyString(proposal?.total_labor_price ?? 0)}</p>
								</div>
								<div className='grid grid-cols-3 items-center gap-4'>
									<Label>Product Total</Label>
									<p className='col-span-2 h-8 text-sm'>{getCurrencyString(proposal?.total_product_price ?? 0)}</p>
								</div>
								<div className='grid grid-cols-3 items-center gap-4'>
									<Label>Width</Label>
									<p className='col-span-2 h-8 text-sm'>{getCurrencyString(proposal?.total_labor_price ?? 0)}</p>
								</div>
							</div>
						</div>
					</HoverCardContent>
					<ProposalDropdownMenu id={id} />
				</HoverCard>
			</Navbar>
			<div className='min-h-header bg-muted/75'>{children}</div>
		</>
	);
};

export default ProposalIdLayout;
