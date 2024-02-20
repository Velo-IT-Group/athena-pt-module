'use client';
import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import SectionsList from './SectionList';
import TemplateCatalog from '@/components/TemplateCatalog';
import { getTemplates, updatePhase } from '@/lib/data';
import { ProjectPhase, ProjectTemplate } from '@/types/manage';
import { v4 as uuid } from 'uuid';
import { FileTextIcon, PlusIcon } from '@radix-ui/react-icons';
import SubmitButton from './SubmitButton';
import { handleNewTemplateInsert, handleSectionInsert } from '@/app/actions';

type Props = {
	id: string;
	sections?: Array<Section & { phases: Array<Phase & { tickets: Array<Ticket & { tasks: Array<Task> }> }> }>;
	templates: ProjectTemplate[];
};

type SectionState = {
	newSection: Section & { phases: Array<Phase & { tickets: Array<Ticket & { tasks: Task[] }> }> };
	updatedSection?: Section;
	pending: boolean;
};

const ProposalBuilder = ({ id, sections, templates }: Props) => {
	const [items, setItems] = useState<Array<Section & { phases: Array<Phase & { tickets: Array<Ticket & { tasks: Array<Task> }> }> }>>(sections ?? []);

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

		Promise.all(changedSections.map((section) => updatePhase(section.id, { order: section.order })));

		return result;
	};

	const handleTemplateDrop = async (index: number) => {
		console.log(templates, index);
		const template = templates[index];
		console.log(template);

		if (!template) return;

		const { workplan } = template;

		console.log(workplan);

		let mappedPhases = workplan.phases.map((phase: ProjectPhase) => {
			const { description, wbsCode } = phase;
			const phaseId = uuid();
			return {
				id: phaseId,
				description: description,
				hours: 0,
				order: parseInt(wbsCode),
				proposal: '',
				section: '',
				strategy_ticket: '',
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
				}),
			};
		});

		console.log(mappedPhases);

		// @ts-ignore
		setItems([...items, { id: uuid(), name: template.name, created_at: Date(), order: items.length + 1, phases: mappedPhases, proposal: id }]);

		// const something: { template: ProjectTemplate; workplan: ProjectWorkPlan } = { template: { id: 1, name: '' }, workplan };

		// addOptimistic(something);

		// console.log(workplan.phases, workplan.phases.length);
		// const offset = destination.index === 0 ? 1 : workplan.phases.length + 1;
		// console.log(offset);
		// const reorderedItems = presort(optimisticState, destination.index, offset);
		// addOptimistic(reorderedItems);
		// opt(reorderedItems);

		const section = await handleNewTemplateInsert(id, template);
		// let createdPhases = phases as unknown as Array<Phase & { tickets: Array<Ticket> }>;
		// setItems([...items, createdPhases]);

		// reorder(items, startIndex, endIndex);

		return;
	};

	const phaseReorder = async (parentId: string, sourceIndex: number, destinationIndex: number) => {
		const itemSubItemMap = items.reduce((acc: any, item) => {
			acc[item.id] = item.phases;
			return acc;
		}, {});

		const subItemsForCorrespondingParent = itemSubItemMap[parentId];
		const reorderedSubItems: any = reorder(subItemsForCorrespondingParent, sourceIndex, destinationIndex);
		let newItems = [...items];
		newItems = newItems.map((item) => {
			if (item.id === parentId) {
				item.phases = reorderedSubItems;
			}
			return item;
		});
		setItems(newItems);

		return;
	};

	async function onDragEnd(result: DropResult) {
		const { destination, source } = result;
		console.log(result);

		// handle dropping a template onto proposal
		if (!destination && source.droppableId === 'templates') {
			console.log('running func');
			await handleTemplateDrop(source.index);
			return;
		}

		if (!destination) return;

		if (result.type.includes('droppablePhaseItem')) {
			const parentId = result.type.split('_')[1];
			console.log(parentId, source.index, destination?.index);

			phaseReorder(parentId, source.index, destination?.index);
		}

		if (source.droppableId === destination?.droppableId && source.index === destination?.index) return;

		// handle dropping a template onto proposal
		if (destination?.droppableId === 'sections' && source.droppableId === 'templates') {
			await handleTemplateDrop(source.index);
			return;
		}

		// handle reording tickets
		if (destination?.droppableId === 'tickets' && source.droppableId === 'tickets') {
			return;
		}

		const reorderedItems = reorder(items, source.index, destination.index);

		setItems(reorderedItems);
	}

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
									<h1 className='text-2xl font-semibold'>Workplan</h1>
									{items.length ? (
										<div className='bg-muted/50 rounded-xl p-4 h-full overflow-y-scroll scroll-m-4 pr-0'>
											<SectionsList sections={items} />
										</div>
									) : (
										<form
											action={handleSectionInsert}
											onSubmit={(event) => {
												event.preventDefault();
												let formData = new FormData(event.currentTarget);
												let newSection: Section = {
													id: uuid(),
													name: 'New Section',
													created_at: Date(),
													order: 0,
													proposal: id,
												};

												// @ts-ignore
												setItems([...items, newSection]);
											}}
											className='h-full border border-dotted flex flex-col justify-center items-center gap-4 rounded-xl'
										>
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
