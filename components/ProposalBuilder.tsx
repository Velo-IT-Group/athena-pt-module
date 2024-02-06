'use client';
import React, { useState } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

type Props = {
	phases: Array<NestedPhase>;
};

const ProposalBuilder = ({ phases }: Props) => {
	const [items, setItems] = useState<Array<NestedPhase>>(phases ?? []);

	const addPhase = () => {
		setItems([
			...items,
			{
				id: String(items.length + 1),
				description: 'New Phase',
				tickets: [],
				hours: 0,
				order: items.length + 1,
				proposal: '',
			},
		]);
	};

	// a little function to help us with reordering the result
	const reorder = (list: Array<Phase & { tickets: Array<Ticket> }>, startIndex: number, endIndex: number) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	function onDragEnd(result: DropResult) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const reorderedItems = reorder(items, result.source.index, result.destination.index);

		setItems(reorderedItems);
	}

	return (
		<div className='bg-muted rounded-xl'>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='droppable'>
					{(provided, snapshot) => (
						<div {...provided.droppableProps} ref={provided.innerRef} className='h-full p-4 rounded-xl space-y-4'>
							{items &&
								items.length > 0 &&
								items?.map((item, index) => (
									<div key={item.id} className='grid gap-6 col-span-2'>
										<Draggable draggableId={item.id} index={index}>
											{(provided, snapshot) => {
												const initialValue = 0;
												return (
													<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
														<Collapsible key={index}>
															<CollapsibleTrigger className='w-full'>
																<Card className='flex'>
																	<CardHeader className='flex flex-row items-center justify-between w-full'>
																		<div className='flex flex-col items-start'>
																			<CardTitle>Phase {item?.order}</CardTitle>
																			<CardDescription>{item?.description ?? 'New Phase'}</CardDescription>
																		</div>
																		<div className='flex flex-col items-start'>
																			<CardTitle>Hours:</CardTitle>
																			<CardDescription>{item.hours ?? 0}</CardDescription>
																		</div>
																	</CardHeader>
																</Card>
															</CollapsibleTrigger>
															<CollapsibleContent className='p-4'>
																<Table>
																	<TableBody>
																		{item.tickets.map((ticket) => (
																			<TableRow key={ticket.id}>
																				<TableCell className='font-medium'>Ticket {ticket.order}</TableCell>
																				<TableCell className='font-medium'>{ticket.summary}</TableCell>
																				<TableCell>{ticket.summary ?? ''}</TableCell>
																				<TableCell className='text-right'>{ticket.budget_hours ?? 0.0}</TableCell>
																			</TableRow>
																		))}
																	</TableBody>
																</Table>
															</CollapsibleContent>
														</Collapsible>
													</div>
												);
											}}
										</Draggable>
									</div>
								))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			{/* <TooltipProvider>
				<Tooltip>
					<TooltipTrigger className='w-full'>
						<Button onClick={() => addPhase()} variant='outline' size='icon'>
							<PlusIcon className='h-4 w-4' />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Add new phase</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider> */}
		</div>
	);
};

export default ProposalBuilder;
