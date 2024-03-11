'use client';
import React, { useRef, useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Cross1Icon, DotsHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { handleProductDelete } from '@/app/actions';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { InternalReviewSelector } from './InternalReviewSelector';

type Props = {
	id: string;
	members: Profile[];
};

const ProposalDropdownMenu = ({ id, members }: Props) => {
	const [open, setOpen] = useState(false);
	const [external, setExternal] = useState(false);
	const [selectedMembers, setSelectedMembers] = useState<Profile[]>([]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' size='icon'>
						<DotsHorizontalIcon className='w-4 h-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem asChild>
						<Link href={`/review/${id}`}>View Proposal</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuLabel>Send for...</DropdownMenuLabel>
					<DropdownMenuSeparator />

					<DropdownMenuItem onClick={() => setOpen(!open)}>Internal review</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => {
							setOpen(!open);
							setExternal(true);
						}}
					>
						External review
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={async () => await handleProductDelete(id)}>Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Send for review</DialogTitle>
					<DialogDescription>Select members from your organization that you&apos;d like to review.</DialogDescription>
				</DialogHeader>
				{external ? (
					<></>
				) : (
					<>
						<form action={async () => {}} className='space-y-4'>
							<div className='flex items-center gap-4'>
								<InternalReviewSelector members={members} />
								<Button
									formAction={(data: FormData) => {
										const selectedMember = members.find((m) => m.id === data.get('selected_member'));
										if (!selectedMember) return;
										setSelectedMembers([...selectedMembers, selectedMember]);
									}}
									size='sm'
									variant='secondary'
								>
									<PlusIcon className='w-4 h-4 mr-2' /> Add
								</Button>
							</div>

							<div>
								{selectedMembers.map((member, index) => (
									<div key={member.id} className='flex items-center justify-between border-b last:border-b-0 py-2'>
										<span className='font-medium'>{member.full_name}</span>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => {
												setSelectedMembers((prev) => [...prev.slice(index, index)]);
											}}
										>
											<Cross1Icon />
										</Button>
									</div>
								))}
							</div>
						</form>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant='secondary'>Cancel</Button>
							</DialogClose>
							<Button>Send Request</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ProposalDropdownMenu;
