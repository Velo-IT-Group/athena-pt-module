'use client';

import { flexRender } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Table as ReactTable } from '@tanstack/react-table';
import { cn, getBackgroundColor } from '@/lib/utils';
import DataTableRow from './data-table-row';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import DataTableCell from './data-table-cell';

interface DataTablePaginationProps<TData> {
	table: ReactTable<TData>;
	hideHeader?: boolean;
	type: string;
}

export function DraggableDataTable<TData>({ table, hideHeader = false, type }: DataTablePaginationProps<TData>) {
	return (
		<div className='rounded-md border'>
			<Table>
				{!hideHeader && (
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
				)}

				<Droppable droppableId={type} type='product'>
					{(provided, snapshot) => (
						<TableBody {...provided.droppableProps} className={cn(getBackgroundColor(snapshot))}>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row, index) => <DataTableRow key={row.id} row={row} />)
							) : (
								<TableRow>
									<TableCell colSpan={table.getAllColumns().length} className='h-24 text-center'>
										No results.
									</TableCell>
								</TableRow>
							)}
							{provided.placeholder}
						</TableBody>
					)}
				</Droppable>
			</Table>
		</div>
	);
}
