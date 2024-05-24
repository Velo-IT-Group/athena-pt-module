'use client';
import React from 'react';
import { Card, CardHeader } from './ui/card';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { ProjectTemplate } from '@/types/manage';
import { Draggable } from 'react-beautiful-dnd';

type Props = {
	template: ProjectTemplate;
	index: number;
};

const TemplateItem = ({ template, index }: Props) => {
	return (
		<Draggable key={template.id} draggableId={String(template.id)} index={index}>
			{(provided) => {
				return (
					<Card key={template.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
						<CardHeader className='flex flex-row items-center gap-2 p-2 space-y-0'>
							<DragHandleDots2Icon className='w-4 h-4 flex-shrink-0' />
							<p className='text-sm tracking-tight line-clamp-1'>{template.name}</p>
						</CardHeader>
					</Card>
				);
			}}
		</Draggable>
	);
};

export default TemplateItem;
