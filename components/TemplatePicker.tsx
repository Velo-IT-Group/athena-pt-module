'use client';
import React from 'react';
import { ProjectTemplate } from '@/types/manage';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Draggable, Droppable } from 'react-beautiful-dnd';

type Props = {
	templates: Array<ProjectTemplate>;
};

const TemplatePicker = ({ templates }: Props) => {
	return (
		<Collapsible>
			<Card>
				<CollapsibleTrigger>
					<CardHeader>
						<CardTitle>Templates</CardTitle>
					</CardHeader>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<ScrollArea className='h-80'>
						<Droppable droppableId='templates' type='group'>
							{(provided) => (
								<CardContent {...provided.droppableProps} ref={provided.innerRef}>
									{templates.map((template, index) => (
										<Draggable key={template.id} draggableId={String(template.id)} index={index}>
											{(provided) => {
												return (
													<div
														key={template.id}
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className='grid grid-cols-2 gap-2'
													>
														<DragHandleDots2Icon className='w-4 h-4' />
														<p className='text-sm tracking-tight line-clamp-1'>{template.name}</p>
													</div>
												);
											}}
										</Draggable>
									))}
								</CardContent>
							)}
						</Droppable>
					</ScrollArea>
				</CollapsibleContent>
			</Card>
		</Collapsible>
	);
};

export default TemplatePicker;
