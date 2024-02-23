'use client';
import React, { useOptimistic, useTransition } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, ArrowUpIcon, DotsHorizontalIcon, DragHandleDots2Icon, PlusIcon } from '@radix-ui/react-icons';
import { handlePhaseDelete } from '@/app/actions';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import TicketsList from './TicketsList';
import { v4 as uuid } from 'uuid';
import { updatePhase } from '@/lib/functions/update';
import { Input } from '@/components/ui/input';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TicketListItem from './TicketListItem';
import SubmitButton from '@/components/SubmitButton';
import { TicketState } from '@/types/optimisticTypes';
import { createTicket } from '@/lib/functions/create';

type Props = {
	phase: Phase;
	tickets: NestedTicket[];
	order: number;
	pending: boolean;
};

const PhaseListItem = ({ phase, tickets, order, pending }: Props) => {
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = React.useState(false);
	const [collapsibleOpen, setCollapsibleOpen] = React.useState(false);

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
	};

	const action = async (data: FormData) => {
		const newTicket = { ...ticketStub, summary: 'New Ticket', order: state.tickets.length };
		data.set('phase', phase.id);

		startTransition(async () => {
			mutate({ newTicket, pending: true });

			// @ts-ignore
			delete newTicket['id'];

			await createTicket(newTicket, []);
		});
	};

	return (
		<div>
			<Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className='space-y-2 bg-background'>
				<div className='flex w-full flex-col items-start rounded-md border p-3 sm:flex-row sm:items-center gap-4'>
					<DragHandleDots2Icon className='w-4 h-4' />

					<div className='flex items-center gap-2 flex-1'>
						<p className='rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground text-nowrap font-medium leading-none'>Phase {order}</p>

						<Input
							readOnly={pending}
							onBlur={async (e) => {
								if (e.currentTarget.value !== phase.description) {
									await updatePhase(phase.id, { description: e.currentTarget.value });
								}
							}}
							className='border border-transparent hover:border-border hover:cursor-default shadow-none px-2'
							defaultValue={phase.description}
						/>
					</div>

					<p className='ml-auto text-sm text-muted-foreground'>
						{state.tickets.reduce((accumulator, currentValue) => accumulator + (currentValue?.budget_hours ?? 0), 0)}hrs
					</p>

					<DropdownMenu open={open} onOpenChange={setOpen}>
						<DropdownMenuTrigger asChild disabled={pending}>
							<Button variant='ghost' size='sm'>
								<DotsHorizontalIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-[200px]'>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuGroup>
								<DropdownMenuItem>Assign to...</DropdownMenuItem>
								<DropdownMenuItem>Set due date...</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>Move</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuItem>
												Move Up
												<DropdownMenuShortcut>
													<ArrowUpIcon />
												</DropdownMenuShortcut>
											</DropdownMenuItem>
											<DropdownMenuItem>
												Move Down
												<DropdownMenuShortcut>
													<ArrowDownIcon />
												</DropdownMenuShortcut>
											</DropdownMenuItem>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => handlePhaseDelete(phase.id)} className='text-red-600'>
									Delete
									<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
					<CollapsibleTrigger asChild>
						<Button variant='ghost' size='sm'>
							<CaretSortIcon className='h-4 w-4' />
							<span className='sr-only'>Toggle</span>
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className='space-y-2'>
					<div className='w-full flex flex-col space-y-2'>
						<Droppable droppableId='tickets' type={`droppableSubItem`}>
							{(provided) => (
								<div ref={provided.innerRef} className='space-y-2 w-full'>
									{tickets.map((ticket, index) => (
										<Draggable key={ticket.id} draggableId={ticket.id} index={index}>
											{(provided) => {
												return (
													<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
														<TicketListItem key={ticket.id} ticket={ticket} order={index + 1} pending={state.pending} mutate={mutate} />
													</div>
												);
											}}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
						<form action={action} className='mx-auto'>
							<Button size='sm'>
								<PlusIcon className='w-4 h-4 mr-2' />
								Add Ticket
							</Button>
						</form>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

export default PhaseListItem;
