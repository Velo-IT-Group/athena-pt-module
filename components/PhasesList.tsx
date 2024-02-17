'use client';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import PhaseListItem from './PhaseListItem';

type Props = {
	phases: Array<Phase & { tickets: Array<Ticket & { tasks: Array<Task> }> }>;
};

const PhasesList = ({ phases }: Props) => {
	return (
		<Droppable droppableId='phases' type='droppablePhaseItem'>
			{(provided) => (
				<div {...provided.droppableProps} ref={provided.innerRef} className='overflow-scroll space-y-2'>
					{phases?.map((phase, index) => {
						return (
							<Draggable key={phase.id} draggableId={phase.id} index={index}>
								{(provided) => {
									return (
										<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
											<PhaseListItem key={phase.id} phase={phase} tickets={phase.tickets} order={index + 1} />
										</div>
									);
								}}
							</Draggable>
						);
					})}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
};

export default PhasesList;
