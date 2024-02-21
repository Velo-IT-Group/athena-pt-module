import { getProposal, getProposals } from '@/lib/data';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Navbar from './Navbar';

let USDollar = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

const ProposalHeader = async ({ id }: { id: string }) => {
	const proposal = await getProposal(id);
	const proposals = await getProposals();

	if (!proposal) return <div></div>;

	return (
		<Navbar title={proposal.name}>
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
		</Navbar>
	);
};

export default ProposalHeader;
