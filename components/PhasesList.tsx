'use client';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PhaseListItem from './PhaseListItem';

type Props = {
	phases: Array<Phase & { tickets: Array<Ticket & { tasks: Array<Task> }> }>;
};

const PhasesList = ({ phases }: Props) => {
	return (
		<>
			{phases?.map((phase, index) => {
				return (
					<Draggable key={phase.id} draggableId={phase.id} index={index}>
						{(provided) => {
							return (
								<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
									<PhaseListItem phase={phase} tickets={phase.tickets} order={index + 1} />
								</div>
							);
						}}
					</Draggable>
				);
			})}
		</>
	);
};

export default PhasesList;
