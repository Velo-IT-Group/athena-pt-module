'use client';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProductListItem from '@/components/ProductListItem';
import { getCurrencyString } from '@/utils/money';
import { CatalogItem } from '@/types/manage';
import { handleProductInsert } from '@/app/actions';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	products: Product[];
	id: string;
}

type ProductState = {
	newProduct: Product;
	updatedProduct?: Product;
	deletedProduct?: string;
	pending: boolean;
};

export function DataTable<TData, TValue>({ columns, data, products, id }: DataTableProps<TData, TValue>) {
	const [isPending, startTransition] = React.useTransition();

	const [state, mutate] = React.useOptimistic({ products, pending: false }, function createReducer(state, newState: ProductState) {
		if (newState.newProduct) {
			return {
				products: [...state.products, newState] as Product[],
				pending: newState.pending,
			};
		} else if (newState.updatedProduct) {
			return {
				products: [...state.products.filter((f) => f.id !== newState.updatedProduct!.id), newState.updatedProduct] as Product[],
				pending: newState.pending,
			};
		} else {
			return {
				products: [...state.products.filter((f) => f.id !== newState.deletedProduct)] as Product[],
				pending: newState.pending,
			};
		}
	});
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
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

	useEffect(() => {
		const keys = Object.keys(rowSelection);
		const item = keys.pop();
		if (!item) return;
		const catalogItem: CatalogItem = data[parseInt(item)] as CatalogItem;
		if (!catalogItem) return;
		const newProduct: Product = {
			id: String(catalogItem?.id) ?? '',
			extended_price: catalogItem?.price ?? 0,
			price: catalogItem?.price ?? 0,
			proposal: id,
			quantity: 1,
			catalog_item_id: 0,
		};
		startTransition(async () => {
			mutate({ newProduct, pending: true });
			await handleProductInsert({
				extended_price: catalogItem?.price ?? 0,
				price: catalogItem?.price ?? 0,
				proposal: id,
				quantity: 1,
				catalog_item_id: 0,
			});
		});
	}, [rowSelection]);

	return (
		<div className='w-full grid grid-cols-7 gap-4 items-start'>
			<div className='w-full col-span-5'>
				<div className='flex items-center py-4'>
					<Input
						placeholder='Filter proposals...'
						value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
						onChange={(event) => table.getColumn('description')?.setFilterValue(event.target.value)}
						className='max-w-sm'
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='ml-auto'>
								Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className='capitalize'
											checked={column.getIsVisible()}
											onCheckedChange={(value: any) => column.toggleVisibility(!!value)}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className='h-24 text-center'>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className='flex items-center justify-end space-x-2 py-4'>
					<div className='flex-1 text-sm text-muted-foreground'>
						{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className='space-x-2'>
						<Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
							Previous
						</Button>
						<Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
							Next
						</Button>
					</div>
				</div>
			</div>
			<Card className='col-span-2'>
				<CardHeader>
					<CardTitle>{state.products?.length ?? 0} added</CardTitle>
					<CardDescription>
						{getCurrencyString(products?.reduce((accumulator, currentValue) => accumulator + (currentValue?.price ?? 0), 0) ?? 0)}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{state.products?.map((product) => {
						return <ProductListItem key={product.id} description={product.id} />;
					})}
				</CardContent>
			</Card>
		</div>
	);
}
