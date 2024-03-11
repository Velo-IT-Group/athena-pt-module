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

// const defaultColumn: Partial<ColumnDef<Product>> = {
// 	cell: ({ getValue, row: { index }, column: { id }, table }) => {
// 		const initialValue = getValue();
// 		// We need to keep and update the state of the cell normally
// 		const [value, setValue] = React.useState(initialValue);

// 		// When the input is blurred, we'll call our table meta's updateData function
// 		const onBlur = () => {
// 			// table.options.meta?.updateData(index, id, value);
// 		};

// 		// If the initialValue is changed external, sync it up with our state
// 		React.useEffect(() => {
// 			setValue(initialValue);
// 		}, [initialValue]);

// 		return <input value={value as string} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />;
// 	},
// };

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
		<div className='space-y-4'>
			<ProductsListToolbar table={table} />
			<DataTable table={table} />
		</div>
	);
};

export default ProductsList;
