'use client';
import { Button } from '@/components/ui/button';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { columns } from '../../../columns';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog } from '@/components/ui/dialog';

const Loading = () => {
	const table = useReactTable<Product>({
		data: [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Dialog open>
			<div className='bg-background py-10 border-b'>
				<div className='flex items-center justify-between container'>
					<h1 className='text-3xl font-medium'>Products</h1>
					<Button disabled>
						<PlusCircledIcon className='h-4 w-4 mr-2' /> Add Product
					</Button>
				</div>
			</div>
			<div className='container py-10'>
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
							{Array(5)
								.fill(null)
								.map((i, index) => (
									<TableRow key={index}>
										{Array(6)
											.fill(null)
											.map((i, index) => (
												<TableCell key={index}>{<Skeleton className='h-9 w-full' />}</TableCell>
											))}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</div>
			</div>
		</Dialog>
	);
};

export default Loading;
