'use client';
import React, { useOptimistic } from 'react';
import { columns } from './columns';

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
import { DataTable } from '@/components/ui/data-table';
import { updateProduct } from '@/lib/functions/update';
import { ProductsListToolbar } from './products-list-toolbar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDownIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { ProductState } from '@/types/optimisticTypes';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import CatalogPicker from './catalog-picker';
import { CatalogItem } from '@/types/manage';

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

type Props = {
	products: NestedProduct[];
	proposal: string;
	catalogItems: CatalogItem[];
	count: number;
	page: number;
	params: { org: string; id: string };
};

const ProductsList = ({ products, proposal, catalogItems, count, page, params }: Props) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [expanded, setExpanded] = React.useState<ExpandedState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [position, setPosition] = React.useState('bottom');

	const [state, mutate] = useOptimistic({ products, pending: false }, function createReducer(state, newState: ProductState) {
		if (newState.newProduct) {
			return {
				products: [...state.products, newState.newProduct] as NestedProduct[],
				pending: newState.pending,
			};
		} else if (newState.newProducts) {
			return {
				products: newState.newProducts as NestedProduct[],
				pending: newState.pending,
			};
		} else if (newState.updatedProduct) {
			return {
				products: [...state.products.filter((f) => f.id !== newState.updatedProduct!.id), newState.updatedProduct] as NestedProduct[],
				pending: newState.pending,
			};
		} else if (newState.updatedProducts) {
			return {
				products: newState.updatedProducts,
				pending: newState.pending,
			};
		} else {
			return {
				products: [...state.products.filter((f) => f.unique_id !== newState.deletedProduct)] as NestedProduct[],
				pending: newState.pending,
			};
		}
	});

	// const productStub: NestedProduct = {
	// 	calculated_cost: null,
	// 	calculated_cost_flag: null,
	// 	calculated_price: null,
	// 	calculated_price_flag: null,
	// 	catalog_item: null,
	// 	category: null,
	// 	cost: null,
	// 	customer_description: null,
	// 	description: null,
	// 	drop_ship_flag: null,
	// 	hide_description_flag: null,
	// 	hide_extended_price_flag: null,
	// 	hide_item_identifier_flag: null,
	// 	hide_price_flag: null,
	// 	hide_quantity_flag: null,
	// 	id: null,
	// 	identifier: null,
	// 	inactive_flag: null,
	// 	manufacturer: null,
	// 	manufacturer_part_number: null,
	// 	parent: null,
	// 	parent_catalog_item: null,
	// 	phase_product_flag: null,
	// 	price: null,
	// 	product_class: null,
	// 	proposal: null,
	// 	quantity: 1,
	// 	recurring_bill_cycle: null,
	// 	recurring_cost: null,
	// 	recurring_cycle_type: null,
	// 	recurring_flag: null,
	// 	recurring_one_time_flag: null,
	// 	recurring_revenue: null,
	// 	sequence_number: null,
	// 	serialized_cost_flag: null,
	// 	serialized_flag: null,
	// 	special_order_flag: null,
	// 	subcategory: null,
	// 	taxable_flag: null,
	// 	type: null,
	// 	unique_id: uuid(),
	// 	unit_of_measure: null,
	// 	vendor: null,
	// };

	// const table = useReactTable<NestedProduct>({
	// 	data: state.products,
	// 	columns,
	// 	enableRowSelection: true,
	// 	onRowSelectionChange: setRowSelection,
	// onSortingChange: setSorting,
	// onColumnFiltersChange: setColumnFilters,
	// onColumnVisibilityChange: setColumnVisibility,
	// getCoreRowModel: getCoreRowModel(),
	// getFilteredRowModel: getFilteredRowModel(),
	// getPaginationRowModel: getPaginationRowModel(),
	// getSortedRowModel: getSortedRowModel(),
	// // getFacetedRowModel: getFacetedRowModel(),
	// // getFacetedUniqueValues: getFacetedUniqueValues(),
	// getExpandedRowModel: getExpandedRowModel(),
	// 	enableExpanding: true,
	// 	autoResetPageIndex,
	// 	getRowId: (row) => row.unique_id,
	// 	getSubRows: (row) => row.products,
	// 	meta: {
	// 		updateProduct,
	// 	},
	// 	state: {
	// 		sorting,
	// 		columnFilters,
	// 		columnVisibility,
	// 		expanded,
	// 		rowSelection,
	// 	},
	// });
	const table = useReactTable<NestedProduct>({
		data: state.products,
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
		getSubRows: (row) => row.products,
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
		<>
			<div className='w-full space-y-4'>
				<div className='flex items-center justify-between'>
					<div className='flex gap-4 items-center'>
						<h1 className='text-2xl font-medium leading-none'>Products</h1>
						{/* <p className='text-muted-foreground text-xs'>1 of 1 packages</p> */}
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant='secondary' size='sm'>
								<PlusCircledIcon className='h-4 w-4 mr-2' /> Add Product
							</Button>
						</DialogTrigger>
						<CatalogPicker proposal={proposal} catalogItems={catalogItems} count={count} page={page} params={params} />
					</Dialog>
				</div>
			</div>
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
