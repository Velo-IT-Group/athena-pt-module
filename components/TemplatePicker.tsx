'use client';
import React from 'react';
import { ProjectTemplate } from '@/types/manage';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Draggable, Droppable } from 'react-beautiful-dnd';

type Props = {
	templates: Array<ProjectTemplate>;
};

const TemplatePicker = ({ templates }: Props) => {
	return (
		<div className='-mx-6'>
			<Droppable droppableId='templates' type='item'>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{templates.map((template, index) => (
							<Draggable key={template.id} draggableId={String(template.id)} index={index}>
								{(provided) => {
									return (
										<div
											key={template.id}
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className='flex items-center gap-2 hover:bg-muted rounded-xl p-2'
										>
											<DragHandleDots2Icon className='w-4 h-4' />
											<p className='text-sm tracking-tight line-clamp-1'>{template.name}</p>
										</div>
									);
								}}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	);
};

export default TemplatePicker;
