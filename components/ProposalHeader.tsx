import { getProposal } from '@/lib/data';
import { ChevronLeftIcon, DotsHorizontalIcon, GearIcon, TrashIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ProposalDetailForm from './ProposalDetailForm';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SubmitButton from './SubmitButton';
import { handleProposalDelete } from '@/app/actions';

const ProposalHeader = async ({ id }: { id: string }) => {
	const proposal = await getProposal(id);

	if (!proposal) return <div></div>;

	return (
		<header className='flex items-center gap-4 w-full px-4 h-14 border-b'>
			<Link href='/proposal'>
				<ChevronLeftIcon strokeWidth='2' className='w-4 h-4' />
			</Link>

			<h1 className='font-semibold text-lg'>
				{proposal?.name ?? 'New Proposal'}
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='outline' size='sm' className='ml-2'>
							<GearIcon className='w-4 h-4' />
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Edit proposal</DialogTitle>
							<DialogDescription>Make changes to generic proposal details here. Click save when you&apos;re done.</DialogDescription>
						</DialogHeader>

						<ProposalDetailForm proposal={proposal} />

						<DialogFooter>
							<SubmitButton>Save changes</SubmitButton>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</h1>

			<Select>
				<SelectTrigger className='ml-auto w-[180px]'>
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
					{/* <DropdownMenuItem asChild>
						<Button variant='ghost' className='text-red-600'>
							<TrashIcon className='mr-2 h-4 w-4' /> Delete
						</Button>
					</DropdownMenuItem> */}
				</DropdownMenuContent>
			</DropdownMenu>

			<Button>Send</Button>
		</header>
	);
};

export default ProposalHeader;
