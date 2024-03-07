'use client';
import React, { useOptimistic, useTransition } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { v4 as uuid } from 'uuid';
import { updatePhase } from '@/lib/functions/update';
import { Input } from '@/components/ui/input';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TicketListItem from './TicketListItem';
import { PhaseState, TicketState } from '@/types/optimisticTypes';
import { createTicket } from '@/lib/functions/create';
import { deletePhase } from '@/lib/functions/delete';

type Props = {
	phase: Phase;
	tickets: NestedTicket[];
	order: number;
	pending: boolean;
	phaseMutation: (action: PhaseState) => void;
};

const PhaseListItem = ({ phase, tickets, order, pending, phaseMutation }: Props) => {
	const [isPending, startTransition] = useTransition();

	const [state, mutate] = useOptimistic({ tickets, pending: false }, function createReducer(state, newState: TicketState) {
		if (newState.newTicket) {
			return {
				tickets: [...state.tickets, newState.newTicket] as NestedTicket[],
				pending: newState.pending,
			};
		} else if (newState.updatedTicket) {
			return {
				tickets: [...state.tickets.filter((f) => f.id !== newState.updatedTicket!.id), newState.updatedTicket] as NestedTicket[],
				pending: newState.pending,
			};
		} else {
			return {
				tickets: [...state.tickets.filter((f) => f.id !== newState.deletedTicket)] as NestedTicket[],
				pending: newState.pending,
			};
		}
	});

	const ticketStub: NestedTicket = {
		id: uuid(),
		summary: 'New Ticket',
		phase: phase.id,
		order: 0,
		budget_hours: 0,
		created_at: new Date().toISOString(),
		visible: true,
	};

	const action = async (data: FormData) => {
		const newTicket = { ...ticketStub, summary: 'New Ticket', order: state.tickets.length + 1 };
		data.set('phase', phase.id);

		startTransition(async () => {
			mutate({ newTicket, pending: true });

			// @ts-ignore
			delete newTicket['id'];

			await createTicket(newTicket, []);
		});
	};

	let sortedTickets = state.tickets?.sort((a, b) => {
		// First, compare by score in descending order
		if (Number(a.order) > Number(b.order)) return 1;
		if (Number(a.order) < Number(b.order)) return -1;

		// If scores are equal, then sort by created_at in ascending order
		// return Number(a.created_at) - Number(b.id);
		return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
	});

	return (
		<Collapsible className='border rounded-xl overflow-hidden'>
			<div className='flex flex-row items-center gap-4 p-4 w-full bg-muted/50'>
				<Input
					readOnly={pending}
					onBlur={async (e) => {
						if (e.currentTarget.value !== phase.description) {
							console.log('updating phase');
							await updatePhase(phase.id, { description: e.currentTarget.value });
						}
					}}
					className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 min-w-60'
					defaultValue={phase.description}
				/>

				<p className='ml-auto text-sm text-muted-foreground'>
					{state.tickets.reduce((accumulator, currentValue) => accumulator + (currentValue?.budget_hours ?? 0), 0)}hrs
				</p>

				<DropdownMenu>
					<DropdownMenuTrigger disabled={pending} asChild>
						<Button variant='outline' size='icon' className='ml-auto'>
							<DotsHorizontalIcon className='w-4 h-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={async () => {
								startTransition(async () => {
									phaseMutation({ deletedPhase: phase.id, pending: true });
									await deletePhase(phase.id);
								});
							}}
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<CollapsibleTrigger asChild>
					<Button variant='ghost' size='sm'>
						<CaretSortIcon className='h-4 w-4' />
						<span className='sr-only'>Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>

			<CollapsibleContent>
				<div className='p-4 space-y-2 border-t'>
					<div className='w-full flex flex-col space-y-2'>
						<Droppable droppableId='tickets' type={`${order - 1}_droppableSubItem`}>
							{(provided) => (
								<div ref={provided.innerRef} className='space-y-2 w-full'>
									{sortedTickets.map((ticket, index) => (
										<Draggable key={ticket.id} draggableId={ticket.id} index={index}>
											{(provided) => {
												return (
													<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
														<TicketListItem
															key={ticket.id}
															ticket={ticket}
															tasks={ticket.tasks ?? []}
															order={index + 1}
															pending={state.pending}
															ticketMutation={mutate}
														/>
													</div>
												);
											}}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
						<form action={action}>
							<Button variant='outline' className='w-full'>
								<PlusIcon className='w-4 h-4 mr-2' /> Add Ticket
							</Button>
						</form>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};

export default PhaseListItem;
