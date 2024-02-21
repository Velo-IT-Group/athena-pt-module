'use client';
import React, { useOptimistic, useTransition } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import PhaseListItem from './PhaseListItem';
import { PlusIcon } from '@radix-ui/react-icons';
import { handlePhaseInsert } from '@/app/actions';
import { v4 as uuid } from 'uuid';
import { Button } from '@/components/ui/button';

type Props = {
	id: string;
	phases: NestedPhase[];
};

type PhaseState = {
	newPhase: NestedPhase;
	updatedPhase?: NestedPhase;
	deletedPhase?: string;
	pending: boolean;
};

const PhasesList = ({ id, phases }: Props) => {
	const [isPending, startTransition] = useTransition();

	const [state, mutate] = useOptimistic({ phases, pending: false }, function createReducer(state, newState: PhaseState) {
		if (newState.newPhase) {
			return {
				phases: [...state.phases, newState] as NestedPhase[],
				pending: newState.pending,
			};
		} else if (newState.updatedPhase) {
			return {
				phases: [...state.phases.filter((f) => f.id !== newState.updatedPhase!.id), newState.updatedPhase] as NestedPhase[],
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
		description: '',
		hours: 0,
		order: state.phases.length,
		id: uuid(),
		section: id,
		tickets: [],
	};

	let sortedPhases = state.phases?.sort((a, b) => {
		// First, compare by score in descending order
		if (Number(a.order) > Number(b.order)) return -1;
		if (Number(a.order) < Number(b.order)) return 1;

		// If scores are equal, then sort by created_at in ascending order
		return Number(a.id) - Number(b.id);
		// return new Date(a.=).getTime() - new Date(b.created_at).getTime();
	});

	return (
		<div className='w-full space-y-2'>
			<Droppable droppableId='phases' type={`droppablePhaseItem_${id}`}>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef} className='overflow-scroll space-y-2'>
						{sortedPhases?.map((phase, index) => {
							return (
								<Draggable key={phase.id} draggableId={phase.id} index={index}>
									{(provided) => {
										return (
											<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
												<PhaseListItem key={phase.id} phase={phase} tickets={phase?.tickets ?? []} order={index + 1} />
											</div>
										);
									}}
								</Draggable>
							);
						})}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<form
				action={async (data: FormData) => {
					data.set('section', id);
					data.set('description', 'New Phase');
					// @ts-ignore
					data.set('order', state.phases.length) as unknown as number;
					startTransition(async () => {
						const newPhase = { ...phaseStub, description: 'New Phase' };
						mutate({ newPhase, pending: true });

						await handlePhaseInsert(data);
					});
				}}
			>
				<Button variant='outline' className='w-full'>
					<PlusIcon className='w-4 h-4 mr-2' /> Add Phase
				</Button>
			</form>
		</div>
	);
};

export default PhasesList;
