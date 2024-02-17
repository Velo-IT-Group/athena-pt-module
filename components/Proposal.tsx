'use client';
import React, { useState } from 'react';
import { ProjectTemplate } from '@/types/manage';
import { DropResult } from 'react-beautiful-dnd';
import { updatePhase } from '@/lib/data';

type Props = {
	proposal: Proposal;
	templates: Array<ProjectTemplate>;
	phases: Array<Phase & { tickets: Array<Ticket & { tasks: Array<Task> }> }>;
};

const Proposal = ({ proposal, templates, phases }: Props) => {
	const [items, setItems] = useState<Array<Phase & { tickets: Array<Ticket> }>>(phases ?? []);

	// a little function to help us with reordering the result
	const reorder = (list: Array<Phase & { tickets: Array<Ticket> }>, startIndex: number, endIndex: number) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		result.forEach((item, index) => (item.order = index + 1));

		const changedPhases: Array<Phase> = [];

		for (var i = endIndex; i < result.length; i++) {
			// console.log(result[i], i);
			result[i].order = i + 1;
			changedPhases.push(result[i]);
		}

		Promise.all(changedPhases.map((phase) => updatePhase(phase.id, { order: phase.order })));

		return result;
	};

	// a little function to help us with reordering the result
	const presort = (list: Array<Phase & { tickets: Array<Ticket> }>, startIndex: number, offset: number) => {
		const result = Array.from(list);
		const changedPhases: Array<Phase> = [];

		for (var i = startIndex; i < result.length; i++) {
			console.log('BEFORE', result[i].order, i);
			result[i].order = i + offset;
			console.log('AFTER', result[i].order, i);
			changedPhases.push(result[i]);
		}

		// Promise.all(changedPhases.map((phase) => updatePhase(phase.id, { order: phase.order })));

		return result;
	};

	async function onDragEnd(result: DropResult) {
		const { destination, source } = result;

		// dropped outside the list
		if (!destination) return;
		if (source.droppableId === destination.droppableId && source.index === destination.index) return;

		// handle dropping a template onto proposal
		// if (destination?.droppableId === 'phases' && source.droppableId === 'templates') {
		// 	console.log(destination.droppableId);
		// 	const templateResult = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/api/templates/${result.draggableId}/workplan`);
		// 	const workplan: ProjectWorkPlan = await templateResult.json();

		// 	console.log(workplan.phases, workplan.phases.length);
		// 	const offset = destination.index === 0 ? 1 : workplan.phases.length + 1;
		// 	console.log(offset);
		// 	const reorderedItems = presort(items, destination.index, offset);
		// 	setItems(reorderedItems);

		// 	const phases = await handleNewTemplateInsert(result.draggableId, proposal.id, offset);
		// 	let createdPhases = phases as unknown as Array<Phase & { tickets: Array<Ticket> }>;
		// 	// @ts-ignore
		// 	setItems([...items, createdPhases]);

		// 	reorder(items, destination.index, destination.index + offset);
		// 	return;
		// }

		// handle reording tickets
		if (destination?.droppableId === 'tickets' && source.droppableId === 'tickets') {
		}

		const reorderedItems = reorder(items, source.index, destination.index);

		// setItems(reorderedItems);
	}

	return (
		<></>
		// <DragDropContext onDragEnd={onDragEnd}>
		// <ResizablePanelGroup direction='horizontal'>
		// 	<ResizablePanel defaultSize={15} className='min-w-64 max-w-72'>
		// 		<aside className='h-full p-4 space-y-4'>
		// 			<ProductCatalog products={[]} />
		// 			<Separator />
		// 			<TemplateCatalog templates={templates} />
		// 		</aside>
		// 	</ResizablePanel>
		// 	<ResizableHandle withHandle />
		// 	<ResizablePanel defaultSize={85} className='p-4'>
		// 		<div className='col-span-4 h-full grid grid-cols-5 gap-4'>
		// 			<div className='col-span-4 overflow-scroll '>
		// 				<ProposalBuilder id={proposal.id} phases={phases} />
		// 			</div>

		// 			<div className='space-y-4'>
		// 				<LaborTotalCard proposal={proposal} />
		// 				<ProductTotalCard />
		// 			</div>
		// 		</div>
		// 	</ResizablePanel>
		// </ResizablePanelGroup>
		// </DragDropContext>
	);
};

export default Proposal;
