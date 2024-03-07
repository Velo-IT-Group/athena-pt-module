'use client';
import React from 'react';
import { productColumns } from './columns';

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { updateProduct } from '@/lib/functions/update';

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

const ProductsList = ({ data }: { data: Product[] }) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const rerender = React.useReducer(() => ({}), {})[1];
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

	const columns = React.useMemo<ColumnDef<Product>[]>(() => [...productColumns], []);

	// Give our default column cell renderer editing superpowers!

	const table = useReactTable<Product>({
		data,
		columns,
		// defaultColumn,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		autoResetPageIndex,
		meta: {
			updateProduct,
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		debugTable: true,
	});

	return <DataTable table={table} />;
};

export default ProductsList;
