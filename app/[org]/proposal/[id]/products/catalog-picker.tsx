'use client';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react';
import { DataTable } from './data-table';
import { catalogColumns } from './columns';
import { CatalogItem } from '@/types/manage';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

const CatalogPicker = ({ catalogItems }: { catalogItems: CatalogItem[] }) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		// @ts-ignore
		catalogItems,
		catalogColumns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});
	return (
		<DialogContent className='max-w-none w-w-padding h-w-padding flex flex-col'>
			<DialogHeader>
				<DialogTitle>Are you absolutely sure?</DialogTitle>
				<DialogDescription>
					This action cannot be undone. This will permanently delete your account and remove your data from our servers.
				</DialogDescription>
			</DialogHeader>
			<div className='flex-1 grid grid-cols-4 gap-4'>
				<div className='col-span-3'>
					<DataTable columns={catalogColumns} data={catalogItems} />
				</div>

				<div className='flex flex-col h-full border rounded-lg'>
					<div className='h-10 px-2 flex items-center justify-between border-b'>
						<p className='text-sm text-muted-foreground'>2 added</p>
						<Button variant='link' size='sm'>
							Clear
						</Button>
					</div>
					<div className='flex-1'></div>
				</div>
			</div>
			<DialogFooter>
				<Button>Add Items</Button>
			</DialogFooter>
		</DialogContent>
	);
};

export default CatalogPicker;
