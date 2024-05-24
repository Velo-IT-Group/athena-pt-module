'use client';
import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createSection } from '@/lib/functions/create';
import { SectionState } from '@/types/optimisticTypes';
import { DialogTrigger } from '@radix-ui/react-dialog';
import React, { useOptimistic, useTransition } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import { CatalogItem } from '@/types/manage';
import SectionItem from './section-item';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { updateSection } from '@/lib/functions/update';
import { reorder } from '@/utils/array';

type Props = {
	params: { org: string; id: string; version: string };
	sections: NestedSection[];
	version: string;
	page: number;
	count: number;
	proposal: string;
	catalogItems: CatalogItem[];
	searchParams?: { [key: string]: string | string[] | undefined };
	section?: string;
	url?: string;
};

const SectionTabs = ({ params, sections, version }: Props) => {
	const isDark = false;
	const pathname = usePathname();
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
		} else if (newState.updatedSections) {
			return {
				sections: state.sections,
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
	// function reorder<T>(list: T[], startIndex: number, endIndex: number) {
	// 	const result = Array.from(list);
	// 	const [removed] = result.splice(startIndex, 1);
	// 	result.splice(endIndex, 0, removed);

	// 	return result;
	// }

	async function onDragEnd(result: DropResult) {
		const { destination, source, type, draggableId } = result;
		console.log(result);

		// handle dropping a template onto proposal
		if (!destination) return;

		// if dropped on the same list and has same index then do nothing
		if (source.droppableId === destination?.droppableId && source.index === destination?.index) return;

		if (type === 'products') {
			const idSplit = draggableId.split('_');
			console.log(idSplit);
			const section = parseInt(idSplit[0]);
		}

		const updatedSections = reorder(state.sections, source.index, destination.index);

		console.log(updatedSections);

		startTransition(async () => {
			mutate({ updatedSections, pending: true });
			await Promise.all(updatedSections.map(({ id, order }) => updateSection({ id, order })));
		});

		// handle dropping a template onto proposal
	}

	const orderedSections = state.sections?.sort((a, b) => {
		// First, compare by score in descending order
		if (Number(a.order) > Number(b.order)) return 1;
		if (Number(a.order) < Number(b.order)) return -1;

		// If scores are equal, then sort by created_at in ascending order
		return Number(a.id) - Number(b.id);
		// return new Date(a.=).getTime() - new Date(b.created_at).getTime();
	});

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='sections'>
					{(provided) => (
						<div ref={provided.innerRef} className='space-y-3'>
							{orderedSections.map((section, index) => (
								<Draggable key={section.id} draggableId={`section-${section.id}`} index={index}>
									{(provided) => (
										<div ref={provided.innerRef} {...provided.draggableProps}>
											<SectionItem key={section.id} section={section} dragHandleProps={provided.dragHandleProps} />
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			<Dialog>
				<DialogTrigger asChild>
					<Button variant='outline'>Add Section</Button>
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
									order: sections.length + 1,
								};

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
		</>
	);
};

export default SectionTabs;
