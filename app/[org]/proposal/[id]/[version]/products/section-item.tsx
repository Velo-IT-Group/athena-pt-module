'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DraggableDataTable } from '@/components/ui/draggable-data-table';
import {
	ColumnFiltersState,
	ExpandedState,
	SortingState,
	getCoreRowModel,
	getExpandedRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Draggable, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { columns } from './columns';
import { DotsHorizontalIcon, Pencil1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import CatalogPicker from './catalog-picker';
import { CatalogItem } from '@/types/manage';
import { updateProduct, updateSection } from '@/lib/functions/update';
import { useState } from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import LabeledInput from '@/components/ui/labeled-input';
import { updateSectionInfo } from './actions';
import SubmitButton from '@/components/SubmitButton';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteSection } from '@/lib/functions/delete';
import { toast } from 'sonner';

type Props = {
	section: NestedSection;
	dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
	proposal: string;
	catalogItems: CatalogItem[];
	params: { org: string; id: string; version: string };
	page: number;
	count: number;
	searchParams?: { [key: string]: string | string[] | undefined };
	url?: string;
};

const SectionItem = ({ section, dragHandleProps, catalogItems, params, page, count, searchParams, url }: Props) => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [expanded, setExpanded] = useState<ExpandedState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const orderedProducts = section?.products?.sort((a, b) => {
		// First, compare by score in descending order
		if (Number(a.order) > Number(b.order)) return 1;
		if (Number(a.order) < Number(b.order)) return -1;

		// If scores are equal, then sort by created_at in ascending order
		return 0;
		// return new Date(a.=).getTime() - new Date(b.created_at).getTime();
	});

	const table = useReactTable<NestedProduct>({
		data: orderedProducts ?? [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getExpandedRowModel: getExpandedRowModel(),
		onExpandedChange: setExpanded,
		enableExpanding: true,
		getRowId: (row) => row.unique_id,
		getSubRows: (row) => {
			let orderedItems = row.products?.sort((a, b) => {
				// First, compare by score in descending order
				if (Number(a.sequence_number) > Number(b.sequence_number)) return 1;
				if (Number(a.sequence_number) < Number(b.sequence_number)) return -1;

				// If scores are equal, then sort by created_at in ascending order
				return Number(a.id) - Number(b.id);
				// return new Date(a.=).getTime() - new Date(b.created_at).getTime();
			});

			return orderedItems;
		},
		meta: {
			updateProduct,
		},
		manualPagination: true,
		// onPaginationChange: onPaginationChange,
		// pageCount: pageCount,
		state: {
			expanded,
			sorting,
			columnFilters,
		},
	});
	return (
		<Card>
			<CardHeader className='group'>
				<CardTitle
					{...dragHandleProps}
					className='flex items-center'
				>
					{section.name}

					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant='ghost'
								size='sm'
								className='ml-2 px-1 opacity-0 h-5 group-hover:opacity-100'
							>
								<Pencil1Icon className='h-4 w-4' />
							</Button>
						</DialogTrigger>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									size='sm'
									className='ml-2 px-1 opacity-0 h-5 group-hover:opacity-100 data-[state=open]:opacity-100'
								>
									<DotsHorizontalIcon className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align='start'>
								<DropdownMenuGroup>
									<DialogTrigger asChild>
										<DropdownMenuItem>
											<Pencil1Icon className='w-4 h-4 mr-2' /> Edit
										</DropdownMenuItem>
									</DialogTrigger>
								</DropdownMenuGroup>

								<DropdownMenuSeparator />

								<DropdownMenuGroup>
									<DropdownMenuItem
										onClick={async () => {
											try {
												await deleteSection(section.id);
												// Optional: Perform any additional actions after successful deletion
											} catch (error) {
												console.error('Error deleting section:', error);
												toast(JSON.stringify(error, null, 2));
												// Optionally, you can notify the user or perform other error handling actions here
											}
										}}
										className='focus:bg-red-50 focus:text-red-500'
									>
										<TrashIcon className='w-4 h-4 mr-2' /> Delete
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>

						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit Section</DialogTitle>
							</DialogHeader>

							<form
								id='updateSection'
								name='updateSection'
								action={updateSectionInfo}
							>
								<input
									name='id'
									hidden
									defaultValue={section.id}
								/>

								<LabeledInput
									name='name'
									defaultValue={section.name}
									label='Name'
								/>

								<DialogFooter className='mt-4'>
									<DialogClose asChild>
										<Button variant='secondary'>Cancel</Button>
									</DialogClose>

									<SubmitButton>Save</SubmitButton>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<DraggableDataTable
					table={table}
					type={section.id}
				/>
			</CardContent>

			<CardFooter>
				<CatalogPicker
					proposal=''
					catalogItems={catalogItems}
					count={count}
					page={page}
					params={params}
					section={section.id}
					searchParams={searchParams}
					url={url}
					productLength={orderedProducts?.length ?? -1}
				/>
			</CardFooter>
		</Card>
	);
};

export default SectionItem;
