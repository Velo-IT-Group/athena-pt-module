'use client';
import React, { useEffect } from 'react';
import SectionListItem from './SectionListItem';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const SectionsList = ({
	sections,
}: {
	sections: Array<Section & { phases: Array<Phase & { tickets: Array<Ticket & { tasks: Array<Task> }> }> }>;
}) => {
	useEffect(() => {
		console.log('SECTIONS', sections);
	}, [sections]);

	return (
		<Droppable droppableId='sections' type='group'>
			{(provided) => (
				<div {...provided.droppableProps} ref={provided.innerRef} className='space-y-4'>
					{sections.map((section, index) => (
						<Draggable key={section.id} draggableId={section.id} index={index}>
							{(provided) => {
								return (
									<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
										<SectionListItem key={section.id} section={section} phases={section.phases} />
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

export default SectionsList;
