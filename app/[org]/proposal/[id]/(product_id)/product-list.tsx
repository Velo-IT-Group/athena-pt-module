'use client';
import { DataTableColumnHeader } from '@/components/ui/DataTableColumnHeader';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrencyString } from '@/utils/money';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef, ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';

const ProductList = ({ products }: { products: Product[] }) => {
	const columns: ColumnDef<Product>[] = [
		{
			accessorKey: 'description',
			header: ({ column }) => {
				return <DataTableColumnHeader column={column} title='Product' className='max-w-96' />;
			},
			cell: ({ row }) => {
				const price = row.original.price ?? 0;
				return (
					<div className='max-w-96'>
						<div className='font-medium text-sm truncate'>{row.getValue('description')}</div>
						<div className='text-muted-foreground text-sm'>{getCurrencyString(price)}</div>
					</div>
				);
			},
			enableSorting: false,
		},
		{
			accessorKey: 'quantity',
			header: ({ column }) => {
				return <DataTableColumnHeader column={column} title='Qty' className='text-center' />;
			},
			cell: ({ row }) => <span className='text-center'>{row.getValue('quantity')}</span>,
			enableSorting: false,
		},
		{
			accessorKey: 'calculated_price',
			header: ({ column }) => {
				return <DataTableColumnHeader column={column} title='Total' className='text-right justify-end' />;
			},
			cell: ({ row }) => (
				<div className='text-right font-medium'>
					{getCurrencyString(row.getValue('calculated_price') ?? (row.original.quantity ?? 1) * (row.original.price ?? 0))}
				</div>
			),
			enableSorting: false,
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) => {
				const product = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Open menu</span>
								<DotsHorizontalIcon className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem>Remove product</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const [expanded, setExpanded] = React.useState<ExpandedState>({});

	const table = useReactTable<NestedProduct>({
		data: products,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onExpandedChange: setExpanded,
		getExpandedRowModel: getExpandedRowModel(),
		enableExpanding: true,
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
		state: {
			expanded,
		},
	});

	return (
		<div className='w-full'>
			<div className=''>
				<Table>
					<TableBody>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header, index) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
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
		</div>
	);
};

export default ProductList;
