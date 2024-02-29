'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import React from 'react';
import { catalogColumns } from './columns';
import { CatalogItem } from '@/types/manage';
import {
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
import { MagnifyingGlassIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton';
import { createProducts } from '@/lib/functions/create';

const CatalogPicker = ({ proposal, catalogItems }: { proposal: string; catalogItems: CatalogItem[] }) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [open, setOpen] = React.useState(false);

	const table = useReactTable<CatalogItem>({
		data: catalogItems,
		columns: catalogColumns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		meta: {
			updateData: (rowIndex: number, columnId: string, value: any) => {
				// Skip page index reset until after next rerender
				// skipAutoResetPageIndex();
				// setData((old) =>
				// 	old.map((row, index) => {
				// 		if (index === rowIndex) {
				// 			return {
				// 				...old[rowIndex]!,
				// 				[columnId]: value,
				// 			};
				// 		}
				// 		return row;
				// 	})
				// );
			},
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<Dialog open={open}>
			<DialogTrigger asChild>
				<Button onClick={() => setOpen(!open)}>
					<PlusCircledIcon className='h-4 w-4 mr-2' /> Add Product
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-none w-w-padding h-w-padding'>
				<form
					className='flex flex-col space-y-3'
					action={async () => {
						const products: ProductInsert[] = table.getFilteredSelectedRowModel().rows.map((row) => {
							const { id, cost, phaseProductFlag, recurringFlag, taxableFlag, manufacturerPartNumber, description, notes, price, vendor, vendorSku } =
								row.original;
							return {
								catalog_item_id: id,
								cost,
								extended_price: price,
								is_phase_item: phaseProductFlag,
								is_recurring: recurringFlag,
								is_taxable: taxableFlag,
								manufacturing_part_number: manufacturerPartNumber,
								name: description,
								notes,
								price,
								proposal,
								quantity: 1,
								suggested_price: price,
								vendor_name: vendor?.name,
								vendor_part_number: vendorSku,
							};
						});
						await createProducts(products);
						setOpen(false);
					}}
				>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your account and remove your data from our servers.
						</DialogDescription>
					</DialogHeader>
					<div className='flex-1 grid grid-cols-4 gap-4'>
						<div className='col-span-3'>
							<div className='flex items-center py-4'>
								<div
									className='flex h-9 items-center w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
									cmdk-input-wrapper=''
								>
									<MagnifyingGlassIcon className='mr-2 h-4 w-4 shrink-0 opacity-50' />
									<Input
										placeholder='Filter products...'
										value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
										onChange={(event) => table.getColumn('description')?.setFilterValue(event.target.value)}
										className='border-0 shadow-none focus-visible:ring-0'
									/>
								</div>
							</div>
							<DataTable table={table} />
							<div className='flex items-center justify-end space-x-2 py-4'>
								<Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
									Previous
								</Button>
								<Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
									Next
								</Button>
							</div>
						</div>

						<div className='flex flex-col h-full border rounded-lg'>
							<div className='h-10 px-2 flex items-center justify-between border-b'>
								<p className='text-sm text-muted-foreground'>{table.getFilteredSelectedRowModel().rows.length} added</p>
								<Button variant='link' size='sm'>
									Clear
								</Button>
							</div>
							<div className='flex-1'>
								{table.getFilteredSelectedRowModel().rows.map((row) => {
									const { id, description } = row.original;
									return <div key={id}>{description}</div>;
								})}
							</div>
						</div>
					</div>

					<DialogFooter>
						<DialogClose>
							<SubmitButton>Add Items</SubmitButton>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CatalogPicker;
