'use client';
import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, EyeOpenIcon, MixerHorizontalIcon, TrashIcon } from '@radix-ui/react-icons';
import { deleteProposal } from '@/lib/functions/delete';
import { useRouter } from 'next/navigation';

const ProposalOptions = ({ proposalId, orgId }: { proposalId: string; orgId: string }) => {
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='secondary' className='px-2 shadow-none'>
					<ChevronDownIcon className='h-4 w-4 text-secondary-foreground' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' alignOffset={-5} className='w-[200px]' forceMount>
				<DropdownMenuLabel>Options</DropdownMenuLabel>
				{/* <DropdownMenuItem>Add To Favorites</DropdownMenuItem> */}
				<DropdownMenuItem
					onClick={() => {
						router.push(`/review/${proposalId}`);
					}}
				>
					<EyeOpenIcon className='mr-2 h-4 w-4' /> Preview
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						router.push(`/${orgId}/proposal/${proposalId}/settings`);
					}}
				>
					<MixerHorizontalIcon className='mr-2 h-4 w-4' /> Settings
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={async () => {
						await deleteProposal(proposalId);
					}}
					className='text-red-500'
				>
					<TrashIcon className='mr-2 h-4 w-4' /> Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProposalOptions;
