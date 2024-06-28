'use client';

import * as React from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { CopyIcon, DotsHorizontalIcon, EnterIcon, ResetIcon, TrashIcon } from '@radix-ui/react-icons';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteProposal } from '@/lib/functions/delete';
import SubmitButton from '@/components/SubmitButton';
import { updateProposal } from '@/lib/functions/update';
import { ServiceTicket } from '@/types/manage';
import ConversionModal from './conversion-modal';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { createVersion } from '@/lib/functions/create';
import { Badge } from '@/components/ui/badge';
import { redirect, useRouter } from 'next/navigation';

type Props = {
	proposal: NestedProposal;
	phases: Phase[];
	tickets: Ticket[];
	versions: Version[];
	ticket: ServiceTicket;
	products: NestedProduct[];
	params: { org: string; id: string; version: string };
};

const ProposalActions = ({ proposal, phases, tickets, versions, ticket, params, products }: Props) => {
	const router = useRouter();
	const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
	const [showOpportunityDialog, setShowOpportunityDialog] = React.useState(false);
	const [showNewVersionDialog, setShowNewVersionDialog] = React.useState(false);
	const [revertVersion, setRevertVersion] = React.useState<Version | undefined>();
	const [showRevertDialog, setShowRevertDialog] = React.useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='secondary'
						size='sm'
					>
						<span className='sr-only'>Actions</span>

						<DotsHorizontalIcon className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end'>
					{/* <DropdownMenuItem onSelect={() => setIsOpen(true)}>
						<MixerHorizontalIcon className='w-4 h-4 mr-2' /> Content preferences
					</DropdownMenuItem> */}

					<DropdownMenuItem onSelect={() => setShowOpportunityDialog(true)}>
						<EnterIcon className='w-4 h-4 mr-2' /> Transfer to Manage
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem onSelect={() => setShowNewVersionDialog(true)}>
						<CopyIcon className='w-4 h-4 mr-2' /> Create New Version
					</DropdownMenuItem>

					{versions && versions.length > 1 && (
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<ResetIcon className='w-4 h-4 mr-2' />
								Revert back
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className='p-0'>
								<Command defaultValue={proposal.working_version.id ?? undefined}>
									<CommandInput
										placeholder='Filter versions...'
										autoFocus={true}
										className='h-9'
									/>
									<CommandList>
										<CommandEmpty>No version found.</CommandEmpty>
										<CommandGroup>
											{versions.map((version) => (
												<CommandItem
													key={version.id}
													value={version.id}
													disabled={version.id === proposal.working_version.id}
													onSelect={() => {
														setShowRevertDialog(true);
														setRevertVersion(version);
													}}
												>
													{`V${version.number}`}
													{version.id === proposal.working_version.id && (
														<Badge
															className='ml-2'
															variant='outline'
														>
															Current
														</Badge>
													)}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
					)}

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onSelect={() => setShowDeleteDialog(true)}
						className='text-red-600 focus:text-red-600 focus:bg-red-50'
					>
						<TrashIcon className='w-4 h-4 mr-2' />
						Delete proposal
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog
				open={showNewVersionDialog}
				onOpenChange={setShowNewVersionDialog}
			>
				<DialogContent className='max-h-w-padding-padding min-h-0 flex flex-col overflow-auto'>
					<form
						className='grid gap-4'
						action={async () => {
							const createdVersion = await createVersion(proposal.id);
							router.replace(`/${params.org}/proposal/${params.id}/${createdVersion}`);
							setShowNewVersionDialog(false);
						}}
					>
						<DialogHeader>
							<DialogTitle>Are you sure?</DialogTitle>
							<DialogDescription>Are you sure you want to make a new version?</DialogDescription>
						</DialogHeader>

						<DialogFooter>
							<Button
								variant='secondary'
								type='button'
							>
								Close
							</Button>
							<SubmitButton>Yes, I Want To Create Version {versions?.length ? versions?.length + 1 : 2}</SubmitButton>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={showRevertDialog}
				onOpenChange={setShowRevertDialog}
			>
				<DialogContent className='max-h-w-padding-padding min-h-0 flex flex-col overflow-auto'>
					<form
						className='grid gap-4'
						action={async () => {
							await updateProposal(proposal.id, { working_version: revertVersion?.id });
							router.replace(`/${params.org}/proposal/${params.id}/${revertVersion?.id}`);
							setShowRevertDialog(false);
						}}
					>
						<DialogHeader>
							<DialogTitle>Are you sure?</DialogTitle>
							<DialogDescription>Are you sure you want to revert back to V{revertVersion?.number}?</DialogDescription>
						</DialogHeader>

						<DialogFooter>
							<Button
								variant='secondary'
								type='button'
							>
								Close
							</Button>
							<SubmitButton>Yes, I Want To Revert To V{revertVersion?.number}</SubmitButton>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={showOpportunityDialog}
				onOpenChange={setShowOpportunityDialog}
			>
				<DialogContent className='max-h-w-padding-padding min-h-0 flex flex-col overflow-auto'>
					<DialogHeader>
						<DialogTitle>Transfer To Manage</DialogTitle>
					</DialogHeader>

					<ConversionModal
						proposal={proposal}
						ticket={ticket}
						phases={phases}
						products={products}
					/>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
			>
				<form
					action={async () => {
						await deleteProposal(proposal.id);
						setShowDeleteDialog(false);
						redirect('/velo-it-group');
					}}
				></form>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This proposal will no longer be accessible by you or others you&apos;ve
							shared it with.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction asChild>
							<SubmitButton variant='destructive'>Delete proposal</SubmitButton>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default ProposalActions;
