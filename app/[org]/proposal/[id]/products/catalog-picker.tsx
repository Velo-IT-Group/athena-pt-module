'use client';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useTransition } from 'react';
import { catalogColumns } from './columns';
import { CatalogItem } from '@/types/manage';
import {
	ColumnFiltersState,
	ExpandedState,
	PaginationState,
	SortingState,
	VisibilityState,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Cross2Icon } from '@radix-ui/react-icons';
import SubmitButton from '@/components/SubmitButton';
import { createProduct } from '@/lib/functions/create';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { convertToSnakeCase } from '@/utils/helpers';
import { getCurrencyString } from '@/utils/money';
import { useRouter } from 'next/navigation';
import Search from '@/components/Search';
import { ProductState } from '@/types/optimisticTypes';

type Props = {
	proposal: string;
	catalogItems: CatalogItem[];
	params: { org: string; id: string };
	page: number;
	count: number;
	mutate: (action: ProductState) => void;
};

const CatalogPicker = ({ proposal, catalogItems, params, page, count, mutate }: Props) => {
	const [isPending, startTransition] = useTransition();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [expanded, setExpanded] = React.useState<ExpandedState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: page,
		pageSize: 10,
	});

	const table = useReactTable<CatalogItem>({
		data: catalogItems,
		columns: catalogColumns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		onExpandedChange: setExpanded,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		pageCount: count,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		enableExpanding: true,
		getSubRows: (row) => row.bundledItems,
		onPaginationChange: setPagination,
		manualPagination: true,
		getRowId: (row) => row.id.toString(),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			expanded,
			pagination,
		},
		debugTable: true,
	});

	return (
		<DialogContent className='max-w-none w-w-padding h-w-padding flex flex-col space-y-3'>
			<DialogHeader>
				<DialogTitle>Add Products</DialogTitle>
			</DialogHeader>

			<div className='flex-1 grid grid-cols-4 gap-4 flex-grow min-h-0'>
				<div className='col-span-3 space-y-4'>
					<div className='flex items-center'>
						<Search baseUrl={`/${params.org}/proposal/${params.id}/products`} placeholder='Search products' />
					</div>

					<DataTable table={table} />

					<div className='flex items-center justify-end space-x-2 py-4'>
						<Button variant='outline' size='sm' type='button' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
							Previous
						</Button>
						<Button variant='outline' size='sm' type='button' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
							Next
						</Button>
					</div>
				</div>

				<Card className='flex-1 flex flex-col overflow-hidden'>
					<CardHeader className='flex-row justify-between items-center border-b'>
						<p className='text-sm text-muted-foreground'>{table.getFilteredSelectedRowModel().rows.length} added</p>
						<Button type='button' onClick={() => table.resetRowSelection()} variant='link' size='sm'>
							Clear
						</Button>
					</CardHeader>
					<CardContent className='flex-1 space-y-2 p-2 overflow-auto'>
						{table.getGroupedSelectedRowModel().rows.map((row) => {
							const { id, description, identifier, vendorSku } = row.original;
							return (
								<Card key={id}>
									<CardHeader>
										<CardTitle>{description}</CardTitle>
										<CardDescription>
											{identifier}
											{vendorSku ? `• ${vendorSku}` : ''}
										</CardDescription>
									</CardHeader>
								</Card>
							);
						})}
					</CardContent>
					<CardFooter>
						<p>
							Subtotal:
							<span className='font-medium font-mono'>
								{getCurrencyString(
									table.getFilteredSelectedRowModel().rows.reduce((accumulator, { original }) => accumulator + (original.price ?? 0), 0)
								)}
							</span>
						</p>
					</CardFooter>
				</Card>
			</div>

			<DialogFooter>
				<SubmitButton
					type='submit'
					onClick={() => {
						const createdProducts: { product: any; bundledItems?: any[] }[] = table.getGroupedSelectedRowModel().rows.map((item) => {
							const bundledItems = item.original?.bundledItems;
							delete item.original.bundledItems;
							return {
								// @ts-ignore
								product: { ...convertToSnakeCase(item.original), proposal },
								bundledItems: bundledItems?.map((p) => {
									// @ts-ignore
									delete p['_info'];
									// @ts-ignore
									return { ...convertToSnakeCase(p), proposal };
								}),
							};
						});

						startTransition(async () => {
							mutate({ newProducts: createdProducts.map((p) => p.product as NestedProduct), pending: true });
							// mutate({ newProducts: createdProducts.product, pending: true });
							// @ts-ignore
							await Promise.all(createdProducts.map((product) => createProduct(product.product, product?.bundledItems)));
						});
					}}
				>
					Add Items
				</SubmitButton>
			</DialogFooter>
		</DialogContent>
	);
};

export default CatalogPicker;
