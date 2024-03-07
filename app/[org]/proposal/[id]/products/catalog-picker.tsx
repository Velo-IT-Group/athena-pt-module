'use client';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react';
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
import { createProducts } from '@/lib/functions/create';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { productFromCatalogItem } from '@/utils/helpers';
import { getCurrencyString } from '@/utils/money';
import { useRouter } from 'next/navigation';
import Search from './search';

type Props = {
	proposal: string;
	catalogItems: CatalogItem[];
	params: { org: string; id: string };
	page: number;
	count: number;
};

const CatalogPicker = ({ proposal, catalogItems, params, page, count }: Props) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [expanded, setExpanded] = React.useState<ExpandedState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: page,
		pageSize: 10,
	});
	const router = useRouter();

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
			<DialogClose
				onClick={() => {
					router.back();
				}}
				className='className="absolute z-50 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
			>
				<Cross2Icon className='h-4 w-4' />
			</DialogClose>

			<DialogHeader>
				<DialogTitle>Add Products</DialogTitle>
			</DialogHeader>

			<div className='flex-1 grid grid-cols-4 gap-4 flex-grow min-h-0'>
				<div className='col-span-3 space-y-4'>
					<div className='flex items-center'>
						<Search params={params} />
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
						{table.getFilteredSelectedRowModel().rows.map((row) => {
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
					formAction={async () => {
						// const bundledProducts =
						const bundledProducts = table.getFilteredSelectedRowModel().rows.filter((row) => row.original.bundledItems?.length);
						const products: ProductInsert[] = table.getFilteredSelectedRowModel().rows.map((item) => productFromCatalogItem(item.original, proposal));
						await createProducts(products);
					}}
					onClick={async () => {
						const bundledProducts = table.getFilteredSelectedRowModel().rows.filter((row) => row.original.bundledItems?.length);
						const products: ProductInsert[] = table.getFilteredSelectedRowModel().rows.map((item) => productFromCatalogItem(item.original, proposal));
						await createProducts(products);
						router.back();
					}}
				>
					Add Items
				</SubmitButton>
			</DialogFooter>
		</DialogContent>
	);
};

export default CatalogPicker;
