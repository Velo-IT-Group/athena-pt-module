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
import { updateProduct, updateSection } from '@/lib/functions/update';
import { move, reorder } from '@/utils/array';
import { start } from 'repl';

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

const SectionTabs = ({
	params,
	sections,
	version,
	page,
	count,
	proposal,
	catalogItems,
	searchParams,
	section,
	url,
}: Props) => {
	const [pending, startTransition] = useTransition();
	const [state, mutate] = useOptimistic({ sections, pending: false }, (state, newState: SectionState) => {
		if (newState.newSection) {
			return {
				sections: [...state.sections, newState.newSection] as Section[],
				pending: newState.pending,
			};
		} else if (newState.updatedSection) {
			return {
				sections: [
					...state.sections.filter((f) => f.id !== newState.updatedSection!.id),
					newState.updatedSection,
				] as Section[],
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

	async function onDragEnd(result: DropResult) {
		const { destination, source, type, draggableId } = result;

		// handle dropping a template onto proposal
		if (!destination) return;

		// if dropped on the same list and has same index then do nothing
		if (source.droppableId === destination?.droppableId && source.index === destination?.index) return;

		if (type === 'product') {
			if (source.droppableId === destination.droppableId) {
				const section = state.sections.find((s) => s.id === source.droppableId);
				const items = reorder(section?.products ?? [], source.index, destination.index);

				const updatedSection = { ...section, products: items };

				console.log(section, items);

				startTransition(async () => {
					mutate({
						updatedSection,
						pending: true,
					});

					await Promise.all(items.map(({ unique_id, order }) => updateProduct(unique_id, { order })));
				});

				return;
			} else {
				const destinationSection = state.sections.find((s) => s.id === destination.droppableId);
				const sourceSection = state.sections.find((s) => s.id === source.droppableId);

				const result = move(sourceSection?.products ?? [], destinationSection?.products ?? [], source, destination);

				const updatedSource = { ...sourceSection, products: result[source.droppableId] };
				const updatedDestination = {
					...destinationSection,
					products: reorder(result[destination.droppableId], source.index, destination.index),
				};

				startTransition(async () => {
					mutate({
						updatedSection: updatedSource,
						pending: true,
					});

					mutate({
						updatedSection: updatedDestination,
						pending: true,
					});

					await Promise.all(
						updatedSource?.products.map(({ unique_id, order }) =>
							updateProduct(unique_id, { section: updatedSource.id, order })
						)
					);
					await Promise.all(
						updatedDestination?.products.map(({ unique_id, order }) =>
							updateProduct(unique_id, { section: updatedDestination.id, order })
						)
					);
				});

				return;
			}
		}

		const updatedSections = reorder(state.sections, source.index, destination.index);

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
						<div
							ref={provided.innerRef}
							className='space-y-3'
						>
							{orderedSections.map((section, index) => (
								<Draggable
									key={section.id}
									draggableId={`section-${section.id}`}
									index={index}
								>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
										>
											<SectionItem
												key={section.id}
												section={section}
												dragHandleProps={provided.dragHandleProps}
												catalogItems={catalogItems}
												count={count}
												page={page}
												params={params}
												proposal={proposal}
												searchParams={searchParams}
												url={url}
											/>
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

						<Input
							placeholder='Section name'
							name='name'
						/>

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
