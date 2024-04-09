'use client';
import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createSection } from '@/lib/functions/create';
import { deleteSection } from '@/lib/functions/delete';
import { updateSection } from '@/lib/functions/update';
import { SectionState } from '@/types/optimisticTypes';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import React, { useOptimistic, useState, useTransition } from 'react';
import { v4 as uuid } from 'uuid';

type Props = {
	sections: Section[];
	proposal: string;
	version: string | null;
};

const SectionTabs = ({ sections, proposal, version }: Props) => {
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

	return (
		<TabsList>
			<TabsTrigger value='all'>All</TabsTrigger>

			{state.sections.map((section) => (
				<Dialog key={section.id}>
					<ContextMenu>
						<ContextMenuTrigger>
							<TabsTrigger value={section.id}>{section.name}</TabsTrigger>
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem>
								<DialogTrigger>Rename</DialogTrigger>
							</ContextMenuItem>
							<ContextMenuItem
								onSelect={() => {
									startTransition(async () => {
										mutate({ deletedSection: section.id, pending: true });
										await deleteSection(section.id);
									});
								}}
								className='text-red-600 focus:text-red-600 focus:bg-red-50'
							>
								Delete
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>

					<DialogContent>
						<form
							className='grid gap-4'
							action={(data: FormData) => {
								console.log('hi');
								startTransition(async () => {
									console.log('running');
									const updatedSection: SectionUpdate = {
										...section,
										name: data.get('name') as string,
									};

									mutate({
										updatedSection,
										pending: true,
									});

									try {
										await updateSection(updatedSection);
									} catch (error) {
										console.error(error);
									}
								});
							}}
						>
							<DialogHeader>
								<DialogTitle>Add section</DialogTitle>
							</DialogHeader>

							<Input placeholder='Section name' name='name' defaultValue={section.name} />

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
			))}

			<Separator orientation='vertical' className='h-4' />

			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow'
					>
						<PlusCircledIcon />
					</Button>
				</DialogTrigger>

				<DialogContent>
					<form
						className='grid gap-4'
						action={(data: FormData) => {
							startTransition(async () => {
								const newSection = { id: uuid(), name: data.get('name') as string, proposal, created_at: new Date().toISOString(), version };

								mutate({
									newSection,
									pending: true,
								});

								try {
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
		</TabsList>
	);
};

export default SectionTabs;
