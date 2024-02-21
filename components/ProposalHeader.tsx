import { getProposal, getProposals } from '@/lib/data';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Navbar from './Navbar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Label } from './ui/label';
import { getCurrencyString } from '@/utils/money';
import Link from 'next/link';

const ProposalHeader = async ({ id }: { id: string }) => {
	const proposal = await getProposal(id);

	if (!proposal) return <div></div>;

	return (
		<Navbar title={proposal.name}>
			<HoverCard>
				<HoverCardTrigger className='ml-auto'>
					<p className='hover:underline'>
						<span className='font-semibold text-muted-foreground text-sm'>Total:</span> {getCurrencyString(proposal.total_price ?? 0)}
					</p>
				</HoverCardTrigger>
				<HoverCardContent className='w-80'>
					<div className='grid gap-4'>
						<div className='space-y-2'>
							<h4 className='font-medium leading-none'>Totals</h4>
							<p className='text-sm text-muted-foreground'>View all the totals of this proposal.</p>
						</div>
						<div className='grid gap-4'>
							<div className='grid grid-cols-3 items-center gap-4'>
								<Label htmlFor='labor_total'>Labor</Label>
								<p id='labor_total' className='text-sm text-muted-foreground col-span-2'>
									{getCurrencyString(proposal.total_labor_price)}
								</p>
							</div>
							<div className='grid grid-cols-3 items-center gap-4'>
								<Label htmlFor='product_total'>Product</Label>
								<p id='product_total' className='text-sm text-muted-foreground col-span-2'>
									{getCurrencyString(proposal.total_product_price)}
								</p>
							</div>
							<div className='grid grid-cols-3 items-center gap-4'>
								<Label htmlFor='recurring'>Recurring</Label>
								<p id='recurring' className='text-sm text-muted-foreground col-span-2'>
									{getCurrencyString(0)}
								</p>
							</div>
							<div className='grid grid-cols-3 items-center gap-4'>
								<Label htmlFor='gross_profit'>Gross Profit</Label>
								<p id='gross_profit' className='text-sm text-muted-foreground col-span-2'>
									{getCurrencyString(0)}
								</p>
							</div>
						</div>
					</div>
				</HoverCardContent>
			</HoverCard>

			<Select>
				<SelectTrigger className='w-[180px]'>
					<SelectValue placeholder='Select a status' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='draft'>Draft</SelectItem>
					<SelectItem value='sent'>Sent</SelectItem>
					<SelectItem value='revising'>Revising</SelectItem>
					<SelectItem value='approved'>Approved</SelectItem>
				</SelectContent>
			</Select>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' size='icon'>
						<DotsHorizontalIcon className='w-4 h-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem asChild>
						<Link href={`/review/${proposal.id}`}>View Quote</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>Duplicate</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className='text-red-600'>Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</Navbar>
	);
};

export default ProposalHeader;
