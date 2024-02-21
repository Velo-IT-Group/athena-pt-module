'use client';
import React, { FormEvent, useOptimistic, useState, useTransition } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import SectionsList from './SectionsList';
import TemplateCatalog from '@/components/TemplateCatalog';
import { updatePhase } from '@/lib/data';
import { ProjectPhase, ProjectTemplate } from '@/types/manage';
import { v4 as uuid } from 'uuid';
import { FileTextIcon, PlusIcon } from '@radix-ui/react-icons';
import SubmitButton from '@/components/SubmitButton';
import { handleNewTemplateInsert, handleSectionInsert } from '@/app/actions';

type Props = {
	id: string;
	sections: NestedSection[];
	templates: ProjectTemplate[];
};

type SectionState = {
	newSection: NestedSection;
	updatedSection?: Section;
	deletedSection?: string;
	pending: boolean;
};

const ProposalBuilder = ({ id, sections, templates }: Props) => {
	const [isPending, startTransition] = useTransition();

	const [state, mutate] = useOptimistic({ sections, pending: false }, function createReducer(state, newState: SectionState) {
		if (newState.newSection) {
			return {
				sections: [...state.sections, newState.newSection] as NestedSection[],
				pending: newState.pending,
			};
		} else if (newState.updatedSection) {
			return {
				sections: [...state.sections.filter((f) => f.id !== newState.updatedSection!.id), newState.updatedSection] as NestedSection[],
				pending: newState.pending,
			};
		} else {
			return {
				sections: [...state.sections.filter((f) => f.id !== newState.deletedSection)] as NestedSection[],
				pending: newState.pending,
			};
		}
	});

	const sectionStub: NestedSection = { created_at: Date(), id: uuid(), name: 'New Section', order: 0, proposal: id, phases: [] };

	// a little function to help us with reordering the result
	const reorder = (
		list: Array<Section & { phases: Array<Phase & { tickets: Array<Ticket & { tasks: Array<Task> }> }> }>,
		startIndex: number,
		endIndex: number
	) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		result.forEach((item, index) => (item.order = index + 1));

		const changedSections: Section[] = [];

		for (var i = endIndex; i < result.length; i++) {
			// console.log(result[i], i);
			result[i].order = i + 1;
			changedSections.push(result[i]);
		}
		console.log(changedSections);

		Promise.all(changedSections.map((section) => updatePhase(section.id, { order: section.order })));

		return result;
	};

	const handleTemplateDrop = async (index: number) => {
		const template = templates[index];

		if (!template) return;

		const { workplan } = template;

		let mappedPhases: NestedPhase[] = workplan.phases.map((phase: ProjectPhase) => {
			const { description, wbsCode } = phase;
			const phaseId = uuid();
			return {
				id: phaseId,
				description: description,
				hours: 0,
				order: parseInt(wbsCode),
				proposal: '',
				section: '',
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
				}) as Array<Ticket & { tasks: Task[] }>,
			};
		});

		const newSection = {
			...sectionStub,
			name: template.name,
			order: index,
			phases: mappedPhases,
		};

		console.log(index);

		startTransition(async () => {
			mutate({
				newSection,
				pending: true,
			});

			await handleNewTemplateInsert(id, template, index);
		});
	};

	// const phaseReorder = async (parentId: string, sourceIndex: number, destinationIndex: number) => {
	// 	const itemSubItemMap = items.reduce((acc: any, item) => {
	// 		acc[item.id] = item.phases;
	// 		return acc;
	// 	}, {});

	// 	const subItemsForCorrespondingParent = itemSubItemMap[parentId];
	// 	const reorderedSubItems: any = reorder(subItemsForCorrespondingParent, sourceIndex, destinationIndex);
	// 	let newItems = [...items];
	// 	newItems = newItems.map((item) => {
	// 		if (item.id === parentId) {
	// 			item.phases = reorderedSubItems;
	// 		}
	// 		return item;
	// 	});
	// 	setItems(newItems);

	// 	return;
	// };

	async function onDragEnd(result: DropResult) {
		const { destination, source } = result;
		console.log(result);

		// handle dropping a template onto proposal
		if (!destination && source.droppableId === 'templates') {
			console.log('running func');
			await handleTemplateDrop(0);
			// reorder(state.sections, source.index, destination?.index);
			return;
		}

		if (!destination) return;

		if (result.type.includes('droppablePhaseItem')) {
			const parentId = result.type.split('_')[1];
			console.log(parentId, source.index, destination?.index);

			// phaseReorder(parentId, source.index, destination?.index);
		}

		if (source.droppableId === destination?.droppableId && source.index === destination?.index) return;

		// handle dropping a template onto proposal
		if (destination?.droppableId === 'sections' && source.droppableId === 'templates') {
			await handleTemplateDrop(destination.index);
			// reorder(state.sections, source.index, destination?.index);

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
		let newSection: NestedSection = {
			...sectionStub,
			name: 'New Section',
		};

		startTransition(async () => {
			mutate({
				newSection,
				pending: true,
			});
			await handleSectionInsert(data);
		});
	};

	let sortedSections = state.sections?.sort((a, b) => {
		// First, compare by score in descending order
		if (Number(a.order) > Number(b.order)) return -1;
		if (Number(a.order) < Number(b.order)) return 1;

		// If scores are equal, then sort by created_at in ascending order
		return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
	});

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='h-full'>
				<div className='flex items-start h-full'>
					<div className='border-r h-full'>
						<TemplateCatalog templates={templates ?? []} />
					</div>
					<div className='w-full h-full overflow-hidden'>
						<div className='h-full flex w-full'>
							<div className='h-full w-full flex'>
								<div className='flex flex-col flex-grow py-8 px-4 space-y-2'>
									<div className='w-full flex justify-between items-center'>
										<h1 className='text-2xl font-semibold'>Workplan</h1>
										<form action={action}>
											<SubmitButton>
												<PlusIcon className='w-4 h-4' />
											</SubmitButton>
										</form>
									</div>
									{sortedSections.length ? (
										<div className='bg-muted/50 rounded-xl p-4 h-full overflow-y-scroll scroll-m-4'>
											<SectionsList id={id} sections={sortedSections} />
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
							</div>
						</div>
					</div>
				</div>
			</div>
		</DragDropContext>
	);
};

export default ProposalBuilder;
