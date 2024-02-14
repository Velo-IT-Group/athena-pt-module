'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const columns: ColumnDef<Proposal>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />,
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => <div className='capitalize'>Draft</div>,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Name
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const id = row.getValue('id');
			return <Link href={`/proposal/${id}`}>{row.getValue('name')}</Link>;
		},
	},
	{
		accessorKey: 'total_labor_price',
		header: () => <div className='text-right'>Amount</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('total_labor_price'));

			// Format the amount as a dollar amount
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);

			return <div className='text-right font-medium'>{formatted}</div>;
		},
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<DotsHorizontalIcon className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>Copy payment ID</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

// export const columns: ColumnDef<Proposal>[] = [
// 	{
// 		id: 'select',
// 		header: ({ table }) => (
// 			<Checkbox
// 				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
// 				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
// 				aria-label='Select all'
// 			/>
// 		),
// 		cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />,
// 		enableSorting: false,
// 		enableHiding: false,
// 	},
// 	{
// 		accessorKey: 'name',
// 		header: 'Name',
// 	},
// 	{
// 		accessorKey: 'labor_hours',
// 		header: 'Labor Hours',
// 	},
// 	{
// 		accessorKey: 'management_hours',
// 		header: 'Management Hours',
// 	},
// 	{
// 		accessorKey: 'sales_hours',
// 		header: 'Sales Hours',
// 	},
// 	{
// 		accessorKey: 'labor_rate',
// 		header: 'Labor Rate',
// 	},
// 	{
// 		accessorKey: 'hours_required',
// 		header: 'Hours Required',
// 	},
// 	{
// 		accessorKey: 'total_labor_price',
// 		header: 'Total Labor Price',
// 	},
// ];
