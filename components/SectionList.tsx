'use client';
import React, { useEffect, useOptimistic, useTransition } from 'react';
import SectionListItem from '../app/(org)/proposal/[id]/workplan/SectionListItem';
import { Draggable, Droppable, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { cn } from '@/lib/utils';
import { handleSectionInsert } from '@/app/actions';
import { Button } from './ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

const SectionsList = ({ id, sections }: { id: string; sections: NestedSection[] }) => {
	const sectionStub: NestedSection = { created_at: Date(), id: '123459', name: 'New Section', order: 1, proposal: '', phases: [], hours: 0 };

	const [isPending, startTransition] = useTransition();
	const [optimisticSections, addOptimisticSection] = useOptimistic<NestedSection[], NestedSection>(
		sections,
		(state: NestedSection[], newPhase: NestedSection) => [...state, newPhase]
	);
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

	return (
		<div>
			<Droppable droppableId='sections'>
				{(provided, snapshot) => (
					<div {...provided.droppableProps} ref={provided.innerRef} className={cn('space-y-4 rounded-xl h-full', getBackgroundColor(snapshot))}>
						{optimisticSections.map((section, index) => (
							<Draggable key={section.id} draggableId={section.id} index={index}>
								{(provided) => {
									return (
										<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
											<SectionListItem key={section.id} section={section} phases={section?.phases ?? []} pending />
										</div>
									);
								}}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<form
				action={async (formData: FormData) => {
					formData.set('proposal', id);

					startTransition(async () => {
						addOptimisticSection({ ...sectionStub, name: 'New Section' });
						await handleSectionInsert(formData);
					});
				}}
				className='w-full'
			>
				<Button type='submit' variant='outline'>
					<PlusIcon className='h-4 w-4' />
				</Button>
			</form>
		</div>
	);
};

export default SectionsList;
