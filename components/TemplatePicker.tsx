'use client';
import React from 'react';
import { ProjectTemplate } from '@/types/manage';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Draggable, Droppable, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader } from './ui/card';
import { cn } from '@/lib/utils';

type Props = {
	templates: Array<ProjectTemplate>;
};

const TemplatePicker = ({ templates }: Props) => {
	const getBackgroundColor = (snapshot: DroppableStateSnapshot): string => {
		// Giving isDraggingOver preference
		if (snapshot.isDraggingOver) {
			return 'bg-pink-50';
		}

		// If it is the home list but not dragging over
		if (snapshot.draggingFromThisWith) {
			return 'bg-blue-50';
		}

		// Otherwise use our default background
		return 'bg-transparent';
	};

	return (
		<Droppable droppableId='templates'>
			{(provided, snapshot) => (
				<div {...provided.droppableProps} ref={provided.innerRef} className={cn('space-y-2 rounded-xl', getBackgroundColor(snapshot))}>
					{templates.map((template, index) => (
						<Draggable key={template.id} draggableId={String(template.id)} index={index}>
							{(provided) => {
								return (
									<div key={template.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className=''>
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
