'use client';
import React, { useState } from 'react';
import ProposalBuilder from '@/components/ProposalBuilder';
import ProposalTotalCard from '@/components/ProposalTotalCard';
import TemplatePicker from '@/components/TemplatePicker';
import { ProjectTemplate, ProjectWorkPlan } from '@/types/manage';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { newTemplate, updatePhase } from '@/lib/data';
import { revalidateTag } from 'next/cache';
import { handleNewTemplateInsert, handlePhaseInsert } from '@/app/actions';
import { list } from 'postcss';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

type Props = {
	proposal: Proposal;
	templates: Array<ProjectTemplate>;
	phases: Array<Phase & { tickets: Array<Ticket> }>;
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
			console.log(result[i], i);
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
			// changedPhases.push(result[i]);
		}

		// Promise.all(changedPhases.map((phase) => updatePhase(phase.id, { order: phase.order })));

		return result;
	};

	async function onDragEnd(result: DropResult) {
		const { destination, source } = result;
		console.log(result, destination, source);
		// dropped outside the list

		// handle dropping a template onto proposal
		if (destination?.droppableId === 'phases' && source.droppableId === 'templates') {
			console.log(destination.droppableId);
			const templateResult = await fetch(`http://localhost:3000/api/templates/${result.draggableId}/workplan`);
			const workplan: ProjectWorkPlan = await templateResult.json();

			console.log(workplan.phases, workplan.phases.length);
			const offset = destination.index === 0 ? 1 : workplan.phases.length + 1;
			console.log(offset);
			const reorderedItems = presort(items, destination.index, offset);
			setItems(reorderedItems);

			const phases = await handleNewTemplateInsert(result.draggableId, proposal.id, offset);
			let createdPhases = phases as unknown as Array<Phase & { tickets: Array<Ticket> }>;
			setItems([...items, createdPhases]);

			// reorder(items, destination.index, destination.index + offset);
			return;
		}

		if (!destination) return;
		if (source.droppableId === destination.droppableId && source.index === destination.index) return;

		console.log(items);

		const reorderedItems = reorder(items, source.index, destination.index);

		setItems(reorderedItems);
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='col-span-4 space-y-4 h-full overflow-scroll'>
				<ProposalBuilder id={proposal.id} phases={phases ?? []} />
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger className='w-full' asChild>
							<form action={handlePhaseInsert}>
								<input name='proposal' defaultValue={proposal.id} className='hidden' />
								<input name='description' defaultValue={'New Phase'} className='hidden' />
								<input name='order' defaultValue={phases.length + 1} className='hidden' />
								<Button variant='outline' size='icon'>
									<PlusIcon className='h-4 w-4' />
								</Button>
							</form>
						</TooltipTrigger>
						<TooltipContent>
							<p>Add new phase</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<div className='space-y-4'>
				<TemplatePicker templates={templates} />
				<ProposalTotalCard proposal={proposal} />
			</div>
		</DragDropContext>
	);
};

export default Proposal;
