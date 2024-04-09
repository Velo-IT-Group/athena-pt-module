'use client';

import * as React from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { CopyIcon, DotsHorizontalIcon, EnterIcon, MixerHorizontalIcon, ResetIcon, TrashIcon } from '@radix-ui/react-icons';

import {
	AlertDialog,
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { deleteProposal } from '@/lib/functions/delete';
import SubmitButton from '@/components/SubmitButton';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { updatePhase, updateProposal } from '@/lib/functions/update';
import { ServiceTicket } from '@/types/manage';
import ConversionModal from './conversion-modal';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { createVersion } from '@/lib/functions/create';
import { Badge } from '@/components/ui/badge';

type Props = {
	proposal: NestedProposal;
	phases: Phase[];
	tickets: Ticket[];
	tasks: Task[];
	versions: Version[];
	ticket: ServiceTicket;
};

const ProposalActions = ({ proposal, phases, tickets, tasks, versions, ticket }: Props) => {
	const [open, setIsOpen] = React.useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
	const [showOpportunityDialog, setShowOpportunityDialog] = React.useState(false);
	const [showNewVersionDialog, setShowNewVersionDialog] = React.useState(false);
	const [revertVersion, setRevertVersion] = React.useState<Version | undefined>();
	const [showRevertDialog, setShowRevertDialog] = React.useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='secondary'>
						<span className='sr-only'>Actions</span>

						<DotsHorizontalIcon className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end'>
					<DropdownMenuItem onSelect={() => setIsOpen(true)}>
						<MixerHorizontalIcon className='w-4 h-4 mr-2' /> Content preferences
					</DropdownMenuItem>

					<DropdownMenuItem onSelect={() => setShowOpportunityDialog(true)}>
						<EnterIcon className='w-4 h-4 mr-2' /> Transfer to Manage
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem onSelect={() => setShowNewVersionDialog(true)}>
						<CopyIcon className='w-4 h-4 mr-2' /> Create New Version
					</DropdownMenuItem>

					{versions && versions.length > 0 && (
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<ResetIcon className='w-4 h-4 mr-2' />
								Revert back
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className='p-0'>
								<Command defaultValue={proposal.working_version ?? undefined}>
									<CommandInput placeholder='Filter versions...' autoFocus={true} className='h-9' />
									<CommandList>
										<CommandEmpty>No version found.</CommandEmpty>
										<CommandGroup>
											{versions.map((version) => (
												<CommandItem
													key={version.id}
													value={version.id}
													disabled={version.id === proposal.working_version}
													onSelect={() => {
														setShowRevertDialog(true);
														setRevertVersion(version);
													}}
												>
													{`V${version.number}`}
													{version.id === proposal.working_version && (
														<Badge className='ml-2' variant='outline'>
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

					<DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className='text-red-600 focus:text-red-600 focus:bg-red-50'>
						<TrashIcon className='w-4 h-4 mr-2' />
						Delete proposal
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={showNewVersionDialog} onOpenChange={setShowNewVersionDialog}>
				<DialogContent className='max-h-w-padding-padding min-h-0 flex flex-col overflow-auto'>
					<form
						className='grid gap-4'
						action={async () => {
							await createVersion(proposal.id);
							setShowNewVersionDialog(false);
						}}
					>
						<DialogHeader>
							<DialogTitle>Are you sure?</DialogTitle>
							<DialogDescription>Are you sure you want to make a new version?</DialogDescription>
						</DialogHeader>

						<DialogFooter>
							<Button variant='secondary' type='button'>
								Close
							</Button>
							<SubmitButton>Yes, I Want To Create Version {versions?.length ? versions?.length + 1 : 2}</SubmitButton>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={showRevertDialog} onOpenChange={setShowRevertDialog}>
				<DialogContent className='max-h-w-padding-padding min-h-0 flex flex-col overflow-auto'>
					<form
						className='grid gap-4'
						action={async () => {
							await updateProposal(proposal.id, { working_version: revertVersion?.id });
							setShowRevertDialog(false);
						}}
					>
						<DialogHeader>
							<DialogTitle>Are you sure?</DialogTitle>
							<DialogDescription>Are you sure you want to revert back to V{revertVersion?.number}?</DialogDescription>
						</DialogHeader>

						<DialogFooter>
							<Button variant='secondary' type='button'>
								Close
							</Button>
							<SubmitButton>Yes, I Want To Revert To V{revertVersion?.number}</SubmitButton>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={showOpportunityDialog} onOpenChange={setShowOpportunityDialog}>
				<DialogContent className='max-h-w-padding-padding min-h-0 flex flex-col overflow-auto'>
					<DialogHeader>
						<DialogTitle>Transfer To Manage</DialogTitle>
					</DialogHeader>

					<ConversionModal proposal={proposal} ticket={ticket} />
				</DialogContent>
			</Dialog>

			<Dialog open={open} onOpenChange={setIsOpen}>
				<DialogContent className='max-h-w-padding-padding min-h-0 flex flex-col overflow-auto'>
					<DialogHeader>
						<DialogTitle>Content filter preferences</DialogTitle>
						<DialogDescription>
							The content filter flags text that may violate our content policy. It&apos;s powered by our moderation endpoint which is free to use to
							moderate your OpenAI API traffic. Learn more.
						</DialogDescription>
					</DialogHeader>

					<Accordion type='single' collapsible className='w-full py-6'>
						<h4 className='text-sm text-muted-foreground'>Playground Warnings</h4>

						<AccordionItem value='show_phases'>
							<div className='flex items-start space-x-4 pt-3'>
								<Switch name='show_phases' id='show_phases' defaultChecked={true} />
								<Label className='grid gap-1 font-normal' htmlFor='show_phases'>
									<span className='font-semibold'>Show phases</span>
									<AccordionTrigger className='text-sm text-muted-foreground pt-0'>Customize which phases are shown?</AccordionTrigger>
								</Label>
							</div>
							<AccordionContent className='space-y-2'>
								{phases.map((phase) => (
									<Card key={phase.id}>
										<CardContent className='flex items-center gap-2 justify-between w-full p-3'>
											<CardTitle>{phase.description}</CardTitle>
											<Switch
												onClick={(e) => {
													console.log(e);
												}}
												formAction={async (data) => {
													console.log(data);
													const visible = data.get('visible') as unknown as boolean;
													console.log(visible);
													await updatePhase(phase.id, { visible });
												}}
												type='submit'
												name='visible'
												defaultChecked={phase.visible ?? false}
											/>
										</CardContent>
									</Card>
								))}
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='show_tickets'>
							<div className='flex items-start space-x-4 pt-3'>
								<Switch name='show_tickets' id='show_tickets' defaultChecked={true} />
								<Label className='grid gap-1 font-normal' htmlFor='show_tickets'>
									<span className='font-semibold'>Show tickets</span>
									<AccordionTrigger className='text-sm text-muted-foreground pt-0'>Customize which tickets are shown?</AccordionTrigger>
								</Label>
							</div>
							<AccordionContent className='space-y-2'>
								{tickets.map((ticket) => (
									<Card key={ticket.id}>
										<CardContent className='flex items-center gap-2 justify-between w-full p-3'>
											<CardTitle>{ticket.summary}</CardTitle>
											<Switch defaultChecked={ticket.visible ?? false} />
										</CardContent>
									</Card>
								))}
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value='show_tasks'>
							<div className='flex items-start space-x-4 pt-3'>
								<Switch name='show_tasks' id='show_tasks' defaultChecked={true} />
								<Label className='grid gap-1 font-normal' htmlFor='show_tasks'>
									<span className='font-semibold'>Show tasks</span>
									<AccordionTrigger className='text-sm text-muted-foreground pt-0'>Customize which tasks are shown?</AccordionTrigger>
								</Label>
							</div>

							<AccordionContent className='space-y-2'>
								{tasks.map((ticket) => (
									<Card key={ticket.id}>
										<CardContent className='flex items-center gap-2 justify-between w-full p-3'>
											<CardTitle>{ticket.summary}</CardTitle>
											<Switch defaultChecked={false} />
										</CardContent>
									</Card>
								))}
							</AccordionContent>
						</AccordionItem>
					</Accordion>

					<DialogFooter>
						<Button variant='secondary' onClick={() => setIsOpen(false)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This proposal will no longer be accessible by you or others you&apos;ve shared it with.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<SubmitButton
							variant='destructive'
							formAction={async () => {
								await deleteProposal('');
								setShowDeleteDialog(false);
							}}
						>
							Delete proposal
						</SubmitButton>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default ProposalActions;
