import { getProposal, getProposals } from '@/lib/data';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import VeloLogo from './VeloLogo';
import SlashIcon from './SlashIcon';
import ProposalPicker from './ProposalPicker';

let USDollar = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

const ProposalHeader = async ({ id }: { id: string }) => {
	const proposal = await getProposal(id);
	const proposals = await getProposals();

	if (!proposal) return <div></div>;

	return (
		<header className='flex items-center gap-4 w-full px-4 h-14'>
			<Link href='/proposal'>
				<VeloLogo classname='w-6 h-6' />
			</Link>

			<SlashIcon className='h-4 opacity-15' />

			<nav className='flex items-center gap-4 w-full h-14'>
				<h1 className='font-semibold text-lg'>{proposal?.name ?? 'New Proposal'}</h1>

				{/* <p className='ml-auto text-sm capitalize'>
					<span className='font-semibold'>Total: </span>
					{USDollar.format(proposal.total_labor_price)}
				</p> */}

				<ProposalPicker proposals={proposals ?? []} />

				<Select>
					<SelectTrigger className='w-[180px] ml-auto'>
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
						<DropdownMenuItem>Duplicate</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className='text-red-600'>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</nav>
		</header>
	);
};

export default ProposalHeader;
