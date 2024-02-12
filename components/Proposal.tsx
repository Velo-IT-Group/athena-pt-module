'use client';
import React, { useState } from 'react';
import ProposalBuilder from '@/components/ProposalBuilder';
import ProposalTotalCard from '@/components/ProposalTotalCard';
import TemplatePicker from '@/components/TemplatePicker';
import { ProjectTemplate } from '@/types/manage';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { updatePhase } from '@/lib/data';

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

	function onDragEnd(result: DropResult) {
		console.log(result);
		const { destination, source } = result;
		// dropped outside the list
		if (!destination) return;
		if (source.droppableId === destination.droppableId && source.index === destination.index) return;

		const reorderedItems = reorder(items, source.index, destination.index);

		setItems(reorderedItems);
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='col-span-4 space-y-4'>
				<ProposalBuilder id={proposal.id} phases={phases ?? []} />
			</div>

			<div className='space-y-4'>
				<TemplatePicker templates={templates} templates_used={proposal.templates_used} />
				<ProposalTotalCard proposal={proposal} />
			</div>
		</DragDropContext>
	);
};

export default Proposal;
