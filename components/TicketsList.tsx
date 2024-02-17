'use client';
import React from 'react';
import TicketListItem from './TicketListItem';
import { Draggable, Droppable } from 'react-beautiful-dnd';

type Props = {
	phase: string;
	tickets: Array<Ticket & { tasks: Task[] }>;
};

const TicketsList = ({ phase, tickets }: Props) => {
	return (
		<Droppable droppableId='tickets' type={`droppableSubItem`}>
			{(provided) => (
				<div ref={provided.innerRef} className='overflow-scroll space-y-2'>
					{tickets.map((ticket, index) => (
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
	);
};

export default TicketsList;
