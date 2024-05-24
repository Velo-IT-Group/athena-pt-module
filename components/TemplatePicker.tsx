'use client';
import React from 'react';
import { ProjectTemplate } from '@/types/manage';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { cn, getBackgroundColor } from '@/lib/utils';
import TemplateItem from './TemplateItem';

type Props = {
	templates: Array<ProjectTemplate>;
};

const TemplatePicker = ({ templates }: Props) => {
	return (
		<Droppable droppableId='templates' type='group'>
			{(provided, snapshot) => (
				<div {...provided.droppableProps} ref={provided.innerRef} className={cn('space-y-2 rounded-xl', getBackgroundColor(snapshot))}>
					{templates.map((template, index) => (
						<Draggable key={template.id} draggableId={String(template.id)} index={index}>
							{(provided) => {
								return (
									<div key={template.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
										<TemplateItem template={template} index={index} />
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

export default TemplatePicker;
