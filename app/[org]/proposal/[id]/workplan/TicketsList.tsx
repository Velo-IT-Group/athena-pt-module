'use client';
import React, { useOptimistic, useRef, useState, useTransition } from 'react';
import TicketListItem from './TicketListItem';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { PlusIcon } from '@radix-ui/react-icons';
import { handleTicketInsert } from '@/app/actions';
import SubmitButton from '../../../../../components/SubmitButton';
import { TicketState } from '@/types/optimisticTypes';

type Props = {
	phase: string;
	tickets: NestedTicket[];
};

const TicketsList = ({ phase, tickets }: Props) => {
	let [isPending, startTransition] = useTransition();

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
	const [optimisticTickets, addOptimisticTicket] = useState<NestedTicket[]>(tickets);

	const ticketStub: NestedTicket = {
		id: uuid(),
		summary: '',
		phase,
		order: 0,
		budget_hours: 0,
		created_at: Date(),
		tasks: [],
	};

	const action = async (data: FormData) => {
		const newTicket = { ...ticketStub, summary: 'New Ticket', order: state.tickets.length };
		data.set('phase', phase);

		startTransition(async () => {
			mutate({ newTicket, pending: true });
			console.log(state.tickets);

			await handleTicketInsert(data);
		});
	};

	let sortedTickets = state.tickets?.sort((a, b) => {
		// First, compare by score in descending order
		if (Number(a.order) > Number(b.order)) return 1;
		if (Number(a.order) < Number(b.order)) return -1;

		// If scores are equal, then sort by created_at in ascending order
		return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
	});

	return (
		<div className='w-full flex flex-col space-y-2'>
			<Droppable droppableId='tickets' type={`droppableSubItem`}>
				{(provided) => (
					<div ref={provided.innerRef} className='space-y-2 w-full'>
						{sortedTickets.map((ticket, index) => (
							<Draggable key={ticket.id} draggableId={ticket.id} index={index}>
								{(provided) => {
									return (
										<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
											<TicketListItem key={ticket.id} ticket={ticket} order={index + 1} />
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
				<SubmitButton size='sm'>
					<PlusIcon className='w-4 h-4 mr-2' />
					Add Ticket
				</SubmitButton>
			</form>
		</div>
	);
};

export default TicketsList;
