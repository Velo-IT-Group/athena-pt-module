'use client';
import React, { useOptimistic, useTransition } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable, DroppableStateSnapshot } from 'react-beautiful-dnd';
import TemplateCatalog from '@/components/TemplateCatalog';
// import { updatePhase } from '@/lib/functions/update';
import { ProjectPhase, ProjectTemplate } from '@/types/manage';
import { v4 as uuid } from 'uuid';
import { FileTextIcon, PlusIcon } from '@radix-ui/react-icons';
import SubmitButton from '@/components/SubmitButton';
import { handleNewTemplateInsert, handlePhaseInsert } from '@/app/actions';
import { PhaseState } from '@/types/optimisticTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import PhaseListItem from './PhaseListItem';
import { cn } from '@/lib/utils';
import { move, reorder } from '@/utils/array';
import { updatePhase } from '@/lib/functions/update';

type Props = {
	id: string;
	phases: NestedPhase[];
	templates: ProjectTemplate[];
};

const ProposalBuilder = ({ id, phases, templates }: Props) => {
	const [isPending, startTransition] = useTransition();

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

	const [state, mutate] = useOptimistic({ phases, pending: false }, function createReducer(state, newState: PhaseState) {
		if (newState.newPhase) {
			return {
				phases: [...state.phases, newState.newPhase] as NestedPhase[],
				pending: newState.pending,
			};
		} else if (newState.newPhases) {
			return {
				phases: [...state.phases, ...newState.newPhases] as NestedPhase[],
				pending: newState.pending,
			};
		} else if (newState.updatedPhase) {
			return {
				phases: [...state.phases.filter((f) => f.id !== newState.updatedPhase!.id), newState.updatedPhase] as NestedPhase[],
				pending: newState.pending,
			};
		} else if (newState.updatedPhases) {
			return {
				phases: [...state.phases, ...newState.updatedPhases] as NestedPhase[],
				pending: newState.pending,
			};
		} else {
			return {
				phases: [...state.phases.filter((f) => f.id !== newState.deletedPhase)] as NestedPhase[],
				pending: newState.pending,
			};
		}
	});

	const phaseStub: NestedPhase = {
		description: 'New Phase',
		hours: 0,
		order: state.phases.length,
		id: uuid(),
		proposal: id,
		tickets: [],
	};

	// a little function to help us with reordering the result
	// const reorder = (list: NestedPhase[], startIndex: number, endIndex: number) => {
	// 	const result = Array.from(list);
	// 	const [removed] = result.splice(startIndex, 1);
	// 	result.splice(endIndex, 0, removed);
	// 	result.forEach((item, index) => (item.order = index + 1));

	// 	const changedPhases: NestedPhase[] = [];

	// 	for (var i = endIndex; i < result.length; i++) {
	// 		// console.log(result[i], i);
	// 		result[i].order = i + 1;
	// 		changedPhases.push(result[i]);
	// 	}
	// 	console.log(changedPhases);

	// 	Promise.all(changedPhases.map((phase) => updatePhase(phase.id, { order: phase.order })));

	// 	return result;
	// };

	const handleTemplateDrop = async (templateIndex: number, destinationIndex?: number) => {
		const template = templates[templateIndex];

		if (!template) return;

		const { workplan } = template;

		let newPhases: NestedPhase[] =
			workplan?.phases.map((phase: ProjectPhase) => {
				const { description, wbsCode } = phase;
				const phaseId = uuid();
				return {
					id: phaseId,
					description: description,
					hours: 0,
					order: parseInt(wbsCode),
					proposal: id,
					tickets: phase.tickets.map((ticket) => {
						const { budgetHours, wbsCode, summary } = ticket;
						const ticketId = uuid();
						return {
							budget_hours: budgetHours,
							created_at: Date(),
							id: ticketId,
							order: parseInt(wbsCode ?? '0'),
							phase: phaseId,
							summary,
							tasks: ticket.tasks?.map((task) => {
								const { notes, summary, priority } = task;
								const taskId = uuid();
								return {
									created_at: Date(),
									id: taskId,
									notes,
									priority,
									summary,
									ticket: ticketId,
								};
							}),
						};
					}) as NestedTicket[],
				};
			}) ?? [];

		startTransition(async () => {
			mutate({
				newPhases,
				pending: true,
			});

			await handleNewTemplateInsert(id, template, destinationIndex ?? 0);
		});
	};

	async function onDragEnd(result: DropResult) {
		const { destination, source } = result;

		// handle dropping a template onto proposal
		if (!destination && source.droppableId === 'templates') {
			console.log('running func');
			await handleTemplateDrop(0);
			// reorder(state.phases, source.index, destination?.index);
			return;
		}

		if (!destination) return;

		if (result.type.includes('droppablePhaseItem')) {
			const parentId = result.type.split('_')[1];
			const test = reorder(state.phases, source.index, destination?.index);
			startTransition(async () => {
				mutate({ updatedPhases: test, pending: true });
				await Promise.all(test.map((phase) => updatePhase(phase.id, { order: phase.order })));
			});
			// console.log(parentId, source.index, destination?.index);

			// phaseReorder(parentId, source.index, destination?.index);
		}

		if (source.droppableId === destination?.droppableId && source.index === destination?.index) return;

		// handle dropping a template onto proposal
		if (destination?.droppableId === 'phases' && source.droppableId === 'templates') {
			const test = reorder(state.phases, source.index, destination?.index);
			mutate({ updatedPhases: test, pending: true });
			// console.log(test);
			// await handleTemplateDrop(source.index, destination.index);

			return;
		}

		// handle reording tickets
		if (destination?.droppableId === 'tickets' && source.droppableId === 'tickets') {
			return;
		}

		// const reorderedItems = reorder(items, source.index, destination.index);

		// setItems(reorderedItems);
	}

	const action = async (data: FormData) => {
		data.set('proposal', id);
		data.set('description', 'New Phase');
		// @ts-ignore
		data.set('order', state.phases.length) as unknown as number;
		startTransition(async () => {
			const newPhase = { ...phaseStub, description: 'New Phase', order: state.phases.length };
			mutate({ newPhase, pending: true });

			await handlePhaseInsert(data);
		});
	};

	let sortedPhases = state.phases?.sort((a, b) => {
		// First, compare by score in descending order
		if (Number(a.order) > Number(b.order)) return 1;
		if (Number(a.order) < Number(b.order)) return -1;

		// If scores are equal, then sort by created_at in ascending order
		return Number(a.id) - Number(b.id);
		// return new Date(a.=).getTime() - new Date(b.created_at).getTime();
	});

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='grid grid-cols-[288px_1fr]'>
				<div className='border-r relative'>
					<TemplateCatalog templates={templates ?? []} />
				</div>
				<ScrollArea className='h-header'>
					<div className='flex flex-col flex-grow py-8 px-4 space-y-2'>
						<div className='w-full flex justify-between items-center'>
							<h1 className='text-2xl font-semibold'>Workplan</h1>
							<form action={action}>
								<SubmitButton>
									<PlusIcon className='w-4 h-4' />
								</SubmitButton>
							</form>
						</div>
						{sortedPhases.length ? (
							<div className='w-full space-y-2'>
								<Droppable droppableId='phases' type={`droppablePhaseItem_${id}`}>
									{(provided, snapshot) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className={cn('space-y-4 rounded-xl h-full min-h-halfScreen', getBackgroundColor(snapshot))}
										>
											{sortedPhases.map((phase, index) => (
												<Draggable key={phase.id} draggableId={phase.id} index={index}>
													{(provided) => {
														return (
															<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
																<PhaseListItem
																	order={index + 1}
																	pending={state.pending}
																	phase={phase}
																	phaseMutation={mutate}
																	tickets={phase?.tickets ?? []}
																/>
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
						) : (
							<form action={action} className='h-full border border-dotted flex flex-col justify-center items-center gap-4 rounded-xl'>
								<div className=' p-6 bg-muted rounded-full'>
									<FileTextIcon className='h-8 w-8' />
								</div>

								<h3 className='text-lg font-medium'>Nothing to show yet</h3>
								<span className='text-muted-foreground'>Drag a template from the left sidebar to begin.</span>
								<SubmitButton>
									<PlusIcon className='w-4 h-4 mr-2' /> Add Section
								</SubmitButton>
							</form>
						)}
					</div>
				</ScrollArea>
			</div>
		</DragDropContext>
	);
};

export default ProposalBuilder;
