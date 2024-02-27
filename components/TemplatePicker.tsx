'use client';
import React from 'react';
import { ProjectTemplate } from '@/types/manage';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Card, CardHeader } from './ui/card';
import { cn, getBackgroundColor } from '@/lib/utils';

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
										<Card>
											<CardHeader className='flex flex-row items-center gap-2 p-2 space-y-0'>
												<DragHandleDots2Icon className='w-4 h-4 flex-shrink-0' />
												<p className='text-sm tracking-tight line-clamp-1'>{template.name}</p>
											</CardHeader>
										</Card>
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
