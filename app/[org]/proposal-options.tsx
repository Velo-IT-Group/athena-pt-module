'use client';
import React, { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, EyeOpenIcon, TrashIcon } from '@radix-ui/react-icons';
import { deleteProposal } from '@/lib/functions/delete';
import { useRouter } from 'next/navigation';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import SubmitButton from '@/components/SubmitButton';
import DuplicateIcon from '@/components/icons/duplicate-icon';
import { duplicateProposal } from '@/lib/functions/create';
import { toast } from 'sonner';

const ProposalOptions = ({ proposal, orgId }: { proposal: Proposal; orgId: string }) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='secondary'
						className='px-2 shadow-none'
					>
						<ChevronDownIcon className='h-4 w-4 text-secondary-foreground' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align='end'
					alignOffset={-5}
					className='w-[200px]'
					forceMount
				>
					<DropdownMenuLabel>Options</DropdownMenuLabel>

					<DropdownMenuItem
						onClick={() => {
							router.push(`/review/${proposal.id}/${proposal.working_version}`);
						}}
					>
						<EyeOpenIcon className='mr-2 h-4 w-4' /> Preview
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={async () => {
							await duplicateProposal(proposal);
						}}
					>
						<DuplicateIcon className='mr-2 h-4 w-4' /> Duplicate
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DialogTrigger asChild>
						<DropdownMenuItem className='text-red-600 focus:text-red-600 focus:bg-red-50'>
							<TrashIcon className='mr-2 h-4 w-4' /> Delete
						</DropdownMenuItem>
					</DialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. Are you sure you want to permanently delete this file from our servers?
					</DialogDescription>
				</DialogHeader>

				<form
					action={async () => {
						try {
							await deleteProposal(proposal.id);
							setOpen(false);
						} catch (error) {
							toast('Error deleting the proposal...', { important: true });
						}
					}}
				>
					<DialogFooter>
						<SubmitButton>Confirm</SubmitButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ProposalOptions;
