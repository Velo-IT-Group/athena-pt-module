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
import SectionItem from './section-item';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import { reorder } from '@/utils/array';

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

const SectionTabs = ({ params, sections, version }: Props) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [isDraggingOver, setIsDraggingOver] = useState(false);

	function getColor(isDraggedOver: boolean, isDark: boolean): string {
		if (isDraggedOver) {
			return 'bg-blue-100';
		}
		return 'bg-muted';
	}

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

	useEffect(() => {
		invariant(ref.current);
		return monitorForElements({
			onDrop({ source, location }) {
				console.log(source.data, location.current.dropTargets);
				const destination = location.current.dropTargets[0];
				if (!destination) {
					// if dropped outside of any drop targets
					return;
				}
				const destinationLocation = destination.data.location as number;
				const sourceLocation = source.data.location as number;

				const piece = state.sections.find((p) => p.id, sourceLocation);

				const updatedSections = reorder(state.sections, sourceLocation, destinationLocation);

				console.log(updatedSections);

				mutate({ updatedSections, pending: true });
				// const restOfPieces = pieces.filter((p) => p !== piece);

				// if (canMove(sourceLocation, destinationLocation, pieceType, pieces) && piece !== undefined) {
				// 	// moving the piece!
				// 	setPieces([{ type: piece.type, location: destinationLocation }, ...restOfPieces]);
				// }
			},
		});
	}, [mutate, state.sections]);

	// a little function to help us with reordering the result
	// function reorder<T>(list: T[], startIndex: number, endIndex: number) {
	// 	const result = Array.from(list);
	// 	const [removed] = result.splice(startIndex, 1);
	// 	result.splice(endIndex, 0, removed);

	// 	console.log(removed, result, startIndex, endIndex);

	// 	return result;
	// }

	// async function onDragEnd(result: DropResult) {
	// 	const { destination, source } = result;

	// 	// handle dropping a template onto proposal
	// 	if (!destination) return;

	// 	// if dropped on the same list and has same index then do nothing
	// 	if (source.droppableId === destination?.droppableId && source.index === destination?.index) return;

	// 	reorder(state.sections, source.index, destination.index);

	// 	// handle dropping a template onto proposal
	// }

	return (
		<div
			className={cn('inline-flex h-9 items-center justify-center rounded-lg p-1 text-muted-foreground', getColor(isDraggingOver, isDark))}
			ref={ref}
		>
			<Link
				href={`/${params.org}/proposal/${params.id}/${params.version}/products`}
				className={cn(
					'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
					pathname === `/${params.org}/proposal/${params.id}/${params.version}/products` && 'bg-background text-foreground shadow'
				)}
			>
				Hardware
			</Link>

			<div className={cn('inline-flex items-center')}>
				{state.sections.map((section, index) => {
					const href = `/${params.org}/proposal/${params.id}/${params.version}/products/section/${section.id}`;
					return (
						<SectionItem
							key={section.id}
							section={section}
							href={href}
							isCurrent={pathname === href}
							isDraggingOver={isDraggingOver}
							setIsDraggingOver={setIsDraggingOver}
						/>
					);
				})}
				{/* {state.sections.map((section, index) => (
								<Draggable key={section.id} draggableId={section.id} index={index}>
									{(provided) => {
										return (
											<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
												<TabsTrigger value={section.id} className='flex items-center gap-2'>
													{section.name}
												</TabsTrigger>
											</div>
										);
									}}
								</Draggable>
								// <Dialog key={section.id}>

								// 	<ContextMenu>
								// 		<ContextMenuTrigger>

								// 		</ContextMenuTrigger>

								// 		<ContextMenuContent>
								// 			<ContextMenuItem>
								// 				<DialogTrigger>Rename</DialogTrigger>
								// 			</ContextMenuItem>

								// 			<ContextMenuItem
								// 				onSelect={() => {
								// 					startTransition(async () => {
								// 						mutate({ deletedSection: section.id, pending: true });
								// 						await deleteSection(section.id);
								// 					});
								// 				}}
								// 				className='text-red-600 focus:text-red-600 focus:bg-red-50'
								// 			>
								// 				Delete
								// 			</ContextMenuItem>
								// 		</ContextMenuContent>
								// 	</ContextMenu>

								// 	<DialogContent>
								// 		<form
								// 			className='grid gap-4'
								// 			action={(data: FormData) => {
								// 				console.log('hi');
								// 				startTransition(async () => {
								// 					console.log('running');
								// 					const updatedSection: SectionUpdate = {
								// 						...section,
								// 						name: data.get('name') as string,
								// 					};

								// 					mutate({
								// 						updatedSection,
								// 						pending: true,
								// 					});

								// 					try {
								// 						await updateSection(updatedSection);
								// 					} catch (error) {
								// 						console.error(error);
								// 					}
								// 				});
								// 			}}
								// 		>
								// 			<DialogHeader>
								// 				<DialogTitle>Add section</DialogTitle>
								// 			</DialogHeader>

								// 			<Input placeholder='Section name' name='name' defaultValue={section.name} />

								// 			<DialogFooter>
								// 				<DialogClose asChild>
								// 					<Button variant='secondary'>Close</Button>
								// 				</DialogClose>

								// 				<DialogClose asChild>
								// 					<SubmitButton>Save</SubmitButton>
								// 				</DialogClose>
								// 			</DialogFooter>
								// 		</form>
								// 	</DialogContent>
								// </Dialog>
							))} */}
			</div>

			<Separator orientation='vertical' className='h-4' />

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
