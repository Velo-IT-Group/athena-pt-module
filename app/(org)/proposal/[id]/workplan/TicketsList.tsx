'use client';
import React, { useRef, useState, useTransition } from 'react';
import TicketListItem from './TicketListItem';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { PlusIcon } from '@radix-ui/react-icons';
import { handleTicketInsert } from '@/app/actions';
import SubmitButton from '../../../../../components/SubmitButton';
import { Input } from '../../../../../components/ui/input';

type Props = {
	phase: string;
	tickets: Array<Ticket & { tasks: Task[] }>;
};

const ticketStub: Ticket & { tasks: Task[] } = {
	id: uuid(),
	summary: '',
	phase: '',
	order: 0,
	budget_hours: 0,
	created_at: Date(),
	tasks: [],
};

type NestedTicket = Ticket & { tasks: Task[] };

const TicketsList = ({ phase, tickets }: Props) => {
	let [isPending, startTransition] = useTransition();

	const [optimisticTickets, addOptimisticTicket] = useState<NestedTicket[]>(tickets);

	return (
		<div className='w-full'>
			<Droppable droppableId='tickets' type={`droppableSubItem`}>
				{(provided) => (
					<div ref={provided.innerRef} className='overflow-scroll space-y-2 w-full'>
						{optimisticTickets.map((ticket, index) => (
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
			<form
				// action={handleTicketInsert}
				onSubmit={async (event) => {
					event.preventDefault();
					console.log(event.currentTarget);
					const formData = new FormData(event.currentTarget);
					// console.log(formData);
					addOptimisticTicket([...optimisticTickets, ticketStub]);
					// startTransition(async () => {
					// });
					await handleTicketInsert(formData);
				}}
			>
				<Input name='summary' defaultValue={'Testing'} hidden className='hidden' />
				<Input name='budget_hours' type='number' defaultValue={0} hidden className='hidden' />
				<Input name='order' type='number' defaultValue={0} hidden className='hidden' />
				<Input name='phase' type='text' defaultValue={phase} hidden className='hidden' />
				<SubmitButton>
					<PlusIcon className='w-4 h-4 mr-2' />
					Add Ticket
				</SubmitButton>
			</form>
		</div>
	);
};

export default TicketsList;
