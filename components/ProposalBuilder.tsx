'use client';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { handlePhaseInsert, handleProposalUpdate } from '@/app/actions';
import { Label } from './ui/label';
import TicketsList from './TicketsList';
import { ScrollArea } from './ui/scroll-area';

type Props = {
	id: string;
	phases: Array<Phase & { tickets: Array<Ticket> }>;
};

const ProposalBuilder = ({ id, phases }: Props) => {
	return (
		<>
			<Droppable droppableId='phases' type='group'>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef} className='bg-muted rounded-xl p-4'>
						{phases && phases.length > 0 ? (
							<ScrollArea className='h-[800px]'>
								<ul className='h-full rounded-xl space-y-4'>
									{phases?.map((phase, index) => {
										phase;
										var tickets = phase.tickets ?? [];
										return (
											<Sheet key={phase.id}>
												<SheetTrigger className='w-full'>
													<Draggable key={phase.id} draggableId={phase.id} index={index}>
														{(provided) => {
															return (
																<Card className='flex' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
																	<CardHeader className='flex flex-row items-center justify-between w-full'>
																		<div className='flex flex-col items-start'>
																			<CardTitle>Phase {phase.order}</CardTitle>
																			<CardDescription>{phase?.description ?? 'New Phase'}</CardDescription>
																		</div>
																		<div className='flex flex-col items-start'>
																			<CardTitle>Hours:</CardTitle>
																			<CardDescription>{phase.hours ?? 0}</CardDescription>
																		</div>
																	</CardHeader>
																</Card>
															);
														}}
													</Draggable>
												</SheetTrigger>
												<SheetContent className='w-[400px] sm:w-[540px] max-w-none'>
													<SheetHeader>
														<SheetTitle>{phase.description}</SheetTitle>

														<div className='grid grid-cols-2 w-full gap-4'>
															<Card>
																<CardHeader>
																	<CardDescription>Total Hours</CardDescription>
																	<CardTitle>{phase.hours ?? 0}</CardTitle>
																</CardHeader>
															</Card>
															<Card>
																<CardHeader>
																	<CardDescription>Total Tickets</CardDescription>
																	<CardTitle>{tickets.length ?? 0}</CardTitle>
																</CardHeader>
															</Card>
														</div>

														<h2 className='font-semibold'>Details</h2>
														<form action={handleProposalUpdate}>
															<Input hidden name='id' value={phase.id} readOnly className='hidden' />
															<div className='grid w-full max-w-sm items-center gap-1.5'>
																<Label htmlFor='description'>Description</Label>
																<Input name='description' id='description' defaultValue={phase.description} placeholder='Name goes here...' />
															</div>

															<Input type='submit' className='hidden' />
														</form>

														<Separator />

														<div className='space-y-2'>
															<h3 className='font-medium'>Tickets</h3>
															<TicketsList tickets={tickets} phase={phase.id} />
															{/* <div className='bg-muted rounded-xl p-2 space-y-2'>
															{tickets.map((ticket: Ticket) => (
																<TicketListItem key={ticket.id} ticket={ticket} />
															))}
														</div> */}
														</div>
													</SheetHeader>
													{/* <SheetFooter>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger className='w-full' asChild>
																<form action={handleTicketInsert}>
																	<input name='phase' value={item.id} className='hidden' />
																	<input name='summary' value={'New Ticket'} className='hidden' />
																	<input name='order' value={tickets.length + 1} className='hidden' />
																	<Button variant='outline' size='icon'>
																		<PlusIcon className='h-4 w-4' />
																	</Button>
																</form>
															</TooltipTrigger>
															<TooltipContent>
																<p>Add new ticket</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</SheetFooter> */}
												</SheetContent>
											</Sheet>
										);
									})}
									{provided.placeholder}
								</ul>
							</ScrollArea>
						) : (
							<div className='flex items-center justify-center w-full border border-dashed rounded-xl p-4'>
								<p className='text-muted-foreground'>Drag a template here or create a new ticket by clicking the plus button below</p>
							</div>
						)}
					</div>
				)}
			</Droppable>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger className='w-full' asChild>
						<form action={handlePhaseInsert}>
							<input name='proposal' defaultValue={id} className='hidden' />
							<input name='description' defaultValue={'New Phase'} className='hidden' />
							<input name='order' defaultValue={phases.length + 1} className='hidden' />
							<Button variant='outline' size='icon'>
								<PlusIcon className='h-4 w-4' />
							</Button>
						</form>
					</TooltipTrigger>
					<TooltipContent>
						<p>Add new phase</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</>
	);
};

export default ProposalBuilder;
