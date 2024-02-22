import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getProposal, getSections, getTicket } from '@/lib/data';
import { getCurrencyString } from '@/utils/money';
import React from 'react';

type Props = {
	params: { id: string };
};

const ProposalPage = async ({ params }: Props) => {
	const proposal = await getProposal(params.id);

	if (!proposal) return <div></div>;

	const ticket = await getTicket(proposal?.service_ticket ?? 0);
	// console.log(ticket);

	return (
		<div className='bg-muted/50 h-full flex-1'>
			<div className='container py-10'>
				<h1 className='text-3xl font-medium tracking-tight'>Overview</h1>
			</div>

			<div className='border-t container py-10 space-y-2'>
				<h3 className='text-2xl font-semibold tracking-tight'>Financial</h3>
				<Card>
					<CardContent className='p-6'>
						<div className='grid grid-cols-4 gap-4'>
							<div className='grid w-full max-w-sm items-center gap-1.5'>
								<Label>Total</Label>
								<div className='grid grid-cols-4 gap-4'>
									<div className='grid w-full max-w-sm items-center gap-1.5'>
										<Label className='text-sm text-muted-foreground'>Labor</Label>
										<p className='text-sm font-medium'>{getCurrencyString(proposal.total_labor_price)}</p>
									</div>
									<div className='grid w-full max-w-sm items-center gap-1.5'>
										<Label className='text-sm text-muted-foreground'>Products</Label>
										<p className='text-sm font-medium'>{getCurrencyString(proposal.total_labor_price)}</p>
									</div>
								</div>
							</div>
							<div className='grid w-full max-w-sm items-center gap-1.5'>
								<Label>Recurring</Label>
								<p className='text-sm text-muted-foreground'>{getCurrencyString(0)}</p>
							</div>
							<div className='grid w-full max-w-sm items-center gap-1.5'>
								<Label>Gross Profit</Label>
								<p className='text-sm text-muted-foreground'>{getCurrencyString(0)}</p>
							</div>
							<div className='grid w-full max-w-sm items-center gap-1.5'>
								<Label>Recurring Gross Profit</Label>
								<p className='text-sm text-muted-foreground'>{getCurrencyString(0)}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='border-t container py-10 space-y-2'>
				<h3 className='text-2xl font-semibold tracking-tight'>Customer Information</h3>
				<Card>
					<CardContent className='p-6'>
						<div className='grid grid-cols-4 gap-4'>
							<div className='grid w-full max-w-sm items-center gap-1.5'>
								<Label>Account Name</Label>
								{/* @ts-ignore */}
								<p className='text-sm text-muted-foreground'>{ticket?.company?.name}</p>
							</div>
							<div className='grid w-full max-w-sm items-center gap-1.5'>
								<Label>Site Address</Label>
								{/* @ts-ignore */}
								<p className='text-sm text-muted-foreground'>{ticket?.company?.identifier}</p>
							</div>
							<div className='grid w-full max-w-sm items-center gap-1.5'>
								<Label>Contact</Label>
								{/* @ts-ignore */}
								<p className='text-sm text-muted-foreground'>{ticket?.contact?.name}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className='border-t container py-10 space-y-2'>
				<h3 className='text-2xl font-semibold tracking-tight'>Ticket Information</h3>
				<Card>
					<CardContent className='p-6'>
						<div className='grid grid-cols-4 gap-4'>
							<div className='grid w-full max-w-sm items-center gap-1.5'>
								<Label>Account Name</Label>
								{/* @ts-ignore */}
								<p className='text-sm text-muted-foreground'>{ticket?.company?.name}</p>
							</div>
							<div className='grid w-full max-w-sm items-center gap-1.5'>
								<Label>Site Address</Label>
								{/* @ts-ignore */}
								<p className='text-sm text-muted-foreground'>{ticket?.company?.identifier}</p>
							</div>
							<div className='grid w-full max-w-sm items-center gap-1.5'>
								<Label>Contact</Label>
								{/* @ts-ignore */}
								<p className='text-sm text-muted-foreground'>{ticket?.contact?.name}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ProposalPage;
