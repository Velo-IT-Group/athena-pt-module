'use client';
import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createSection } from '@/lib/functions/create';
import { cn, getBackgroundColor } from '@/lib/utils';
import { SectionState } from '@/types/optimisticTypes';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import React, { useOptimistic, useState, useTransition } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { changeSectionCookie } from './actions';

type Props = {
	sections: Section[];
	proposal: string;
	version: string;
	defaultTab?: string;
};

const SectionTabs = ({ sections, proposal, version, defaultTab = 'all' }: Props) => {
	const [pending, startTransition] = useTransition();
	const [state, mutate] = useOptimistic({ sections, pending: false }, (state, newState: SectionState) => {
		if (newState.newSection) {
			return {
				sections: [...state.sections, newState.newSection] as Section[],
				pending: newState.pending,
			};
		} else if (newState.updatedSection) {
			return {
				sections: [...state.sections.filter((f) => f.id !== newState.updatedSection!.id), newState.updatedSection] as Section[],
				pending: newState.pending,
			};
		} else {
			return {
				sections: [...state.sections.filter((f) => f.id !== newState.deletedSection)] as Section[],
				pending: newState.pending,
			};
		}
	});

	// a little function to help us with reordering the result
	function reorder<T>(list: T[], startIndex: number, endIndex: number) {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		console.log(removed, result, startIndex, endIndex);

		return result;
	}

	async function onDragEnd(result: DropResult) {
		const { destination, source } = result;

		// handle dropping a template onto proposal
		if (!destination) return;

		// if dropped on the same list and has same index then do nothing
		if (source.droppableId === destination?.droppableId && source.index === destination?.index) return;

		reorder(state.sections, source.index, destination.index);

		// handle dropping a template onto proposal
	}

	return (
		<Tabs defaultValue={defaultTab} onValueChange={(e) => changeSectionCookie(proposal, e)}>
			<DragDropContext onDragEnd={onDragEnd}>
				<TabsList>
					<TabsTrigger value='all'>All</TabsTrigger>

					<Droppable droppableId='phases' direction='horizontal'>
						{(provided, snapshot) => (
							<div {...provided.droppableProps} ref={provided.innerRef} className={cn('inline-flex items-center', getBackgroundColor(snapshot))}>
								{state.sections.map((section, index) => (
									<Draggable key={section.id} draggableId={section.id} index={index}>
										{(provided) => {
											return (
												<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
													<TabsTrigger value={section.id} className='flex items-center gap-2'>
														{section.name}
													</TabsTrigger>
												</div>
											);
										}}
									</Draggable>
									// <Dialog key={section.id}>

									// 	<ContextMenu>
									// 		<ContextMenuTrigger>

									// 		</ContextMenuTrigger>

									// 		<ContextMenuContent>
									// 			<ContextMenuItem>
									// 				<DialogTrigger>Rename</DialogTrigger>
									// 			</ContextMenuItem>

									// 			<ContextMenuItem
									// 				onSelect={() => {
									// 					startTransition(async () => {
									// 						mutate({ deletedSection: section.id, pending: true });
									// 						await deleteSection(section.id);
									// 					});
									// 				}}
									// 				className='text-red-600 focus:text-red-600 focus:bg-red-50'
									// 			>
									// 				Delete
									// 			</ContextMenuItem>
									// 		</ContextMenuContent>
									// 	</ContextMenu>

									// 	<DialogContent>
									// 		<form
									// 			className='grid gap-4'
									// 			action={(data: FormData) => {
									// 				console.log('hi');
									// 				startTransition(async () => {
									// 					console.log('running');
									// 					const updatedSection: SectionUpdate = {
									// 						...section,
									// 						name: data.get('name') as string,
									// 					};

									// 					mutate({
									// 						updatedSection,
									// 						pending: true,
									// 					});

									// 					try {
									// 						await updateSection(updatedSection);
									// 					} catch (error) {
									// 						console.error(error);
									// 					}
									// 				});
									// 			}}
									// 		>
									// 			<DialogHeader>
									// 				<DialogTitle>Add section</DialogTitle>
									// 			</DialogHeader>

									// 			<Input placeholder='Section name' name='name' defaultValue={section.name} />

									// 			<DialogFooter>
									// 				<DialogClose asChild>
									// 					<Button variant='secondary'>Close</Button>
									// 				</DialogClose>

									// 				<DialogClose asChild>
									// 					<SubmitButton>Save</SubmitButton>
									// 				</DialogClose>
									// 			</DialogFooter>
									// 		</form>
									// 	</DialogContent>
									// </Dialog>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>

					<Separator orientation='vertical' className='h-4' />

					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant='ghost'
								size='sm'
								className='inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow'
							>
								<PlusCircledIcon />
							</Button>
						</DialogTrigger>

						<DialogContent>
							<form
								className='grid gap-4'
								action={(data: FormData) => {
									startTransition(async () => {
										const newSection: SectionInsert = {
											id: uuid(),
											name: data.get('name') as string,
											created_at: new Date().toISOString(),
											version,
											order: 1,
										};

										console.log(newSection);

										mutate({
											newSection,
											pending: true,
										});

										try {
											delete newSection['id'];
											delete newSection['created_at'];
											await createSection(newSection);
										} catch (error) {
											console.error(error);
										}
									});
								}}
							>
								<DialogHeader>
									<DialogTitle>Add section</DialogTitle>
								</DialogHeader>

								<Input placeholder='Section name' name='name' />

								<DialogFooter>
									<DialogClose asChild>
										<Button variant='secondary'>Close</Button>
									</DialogClose>

									<DialogClose asChild>
										<SubmitButton>Save</SubmitButton>
									</DialogClose>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</TabsList>
			</DragDropContext>
		</Tabs>
	);
};

export default SectionTabs;
