'use client';
import React from 'react';
import { columns } from './columns';

import {
	ColumnFiltersState,
	ExpandedState,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	getExpandedRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { updateProduct } from '@/lib/functions/update';
import { ProductsListToolbar } from './products-list-toolbar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';

function useSkipper() {
	const shouldSkipRef = React.useRef(true);
	const shouldSkip = shouldSkipRef.current;

	// Wrap a function with this to skip a pagination reset temporarily
	const skip = React.useCallback(() => {
		shouldSkipRef.current = false;
	}, []);

	React.useEffect(() => {
		shouldSkipRef.current = true;
	});

	return [shouldSkip, skip] as const;
}

const ProductsList = ({ data }: { data: NestedProduct[] }) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [expanded, setExpanded] = React.useState<ExpandedState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [position, setPosition] = React.useState('bottom');

	const [rowSelection, setRowSelection] = React.useState({});
	const rerender = React.useReducer(() => ({}), {})[1];
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

	const table = useReactTable<NestedProduct>({
		data,
		columns,
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getExpandedRowModel: getExpandedRowModel(),
		autoResetPageIndex,
		getSubRows: (row) => row.products,
		meta: {
			updateProduct,
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			expanded,
			rowSelection,
		},
		debugTable: true,
	});

	return (
		<>
			<div className='space-y-4 grow'>
				<ProductsListToolbar table={table} />
				<DataTable table={table} />
			</div>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-muted-foreground text-sm'>1 – 1 of 1</p>
				</div>
				<div className='flex items-center gap-2'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' size='sm' className='text-muted-foreground'>
								Products per page: 25 <ChevronDownIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56'>
							<DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
								<DropdownMenuRadioItem value='top'>Top</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value='bottom'>Bottom</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value='right'>Right</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
					<div className='flex items-center justify-end space-x-2 py-4'>
						<Button variant='outline' size='sm' type='button' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
							Previous
						</Button>
						<Button variant='outline' size='sm' type='button' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
							Next
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductsList;
