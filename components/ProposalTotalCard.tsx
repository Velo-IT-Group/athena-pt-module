'use client';
import { handleProposalUpdate } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
	proposal: Proposal;
};

let USDollar = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

const ProposalTotalCard = ({ proposal }: Props) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Totals</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={handleProposalUpdate}>
					<div className='grid w-full items-center gap-4'>
						<input name='id' defaultValue={proposal.id} className='hidden' />
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='total-labor-hours'>Total Labor Hours</Label>
							<p className='text-sm font-medium text-muted-foreground'>{proposal.labor_hours}</p>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='sales-labor'>Sales Ticket and Proposal Work</Label>
							<Input name='sales-labor' type='number' defaultValue={proposal.sales_hours} placeholder='Total Labor Hours' />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='project-management'>Project Management</Label>
							<Input name='project-management' type='number' defaultValue={proposal.management_hours} placeholder='Total Labor Hours' />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='hours-required'>Hours Required</Label>
							<p className='text-sm font-medium text-muted-foreground'>{proposal.hours_required}</p>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='labor-rate'>Labor Rate</Label>
							<p className='text-sm font-medium text-muted-foreground'>{USDollar.format(Number(proposal.labor_rate))}</p>
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='total-labor-price'>Total Labor Price</Label>
							<p className='text-sm font-medium text-muted-foreground'>{USDollar.format(Number(proposal.total_labor_price))}</p>
						</div>
					</div>
					<input type='submit' className='hidden' />
				</form>
			</CardContent>
		</Card>
	);
};

export default ProposalTotalCard;
