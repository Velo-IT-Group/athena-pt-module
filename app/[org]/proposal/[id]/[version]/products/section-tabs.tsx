'use client';
import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createSection } from '@/lib/functions/create';
import { SectionState } from '@/types/optimisticTypes';
import { DialogTrigger } from '@radix-ui/react-dialog';
import React, { useOptimistic, useState, useTransition } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
import ProductSection from './product-section';
import { CatalogItem } from '@/types/manage';

type Props = {
	params: { org: string; id: string; version: string };
	sections: Section[];
	version: string;
	page: number;
	count: number;
	proposal: string;
	catalogItems: CatalogItem[];
	searchParams?: { [key: string]: string | string[] | undefined };
	section?: string;
	url?: string;
};

const SectionTabs = ({ params, sections, version, catalogItems, count, page, proposal, searchParams, section, url }: Props) => {
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
		} else {
			return {
				sections: [...state.sections.filter((f) => f.id !== newState.deletedSection)] as Section[],
				pending: newState.pending,
			};
		}
	});

	// a little function to help us with reordering the result
	function reorder<T>(list: T[], startIndex: number, endIndex: number) {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		console.log(removed, result, startIndex, endIndex);

		return result;
	}

	async function onDragEnd(result: DropResult) {
		const { destination, source } = result;

		// handle dropping a template onto proposal
		if (!destination) return;

		// if dropped on the same list and has same index then do nothing
		if (source.droppableId === destination?.droppableId && source.index === destination?.index) return;

		reorder(state.sections, source.index, destination.index);

		// handle dropping a template onto proposal
	}

	return (
		<div className='space-y-4'>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId='phases' direction='horizontal'>
					{(provided, snapshot) => (
						<div>
							{sections?.map((section) => (
								<section key={section.id} className='relative'>
									<ProductSection
										section={section}
										catalogItems={catalogItems}
										count={count}
										page={page}
										params={params}
										searchParams={searchParams}
										url={url}
									/>
								</section>
							))}
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
		</div>
	);
};

export default SectionTabs;
