'use client';

import { flexRender } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Table as ReactTable } from '@tanstack/react-table';
import { cn, getBackgroundColor } from '@/lib/utils';
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
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
										>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
				)}

				<Droppable
					droppableId={type}
					type='product'
				>
					{(provided, snapshot) => (
						<TableBody
							ref={provided.innerRef}
							{...provided.droppableProps}
							className={cn(getBackgroundColor(snapshot))}
						>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row, index) => (
									<Draggable
										key={(row.original as Product).unique_id}
										draggableId={(row.original as Product).unique_id}
										index={index}
									>
										{(provided) => (
											<TableRow
												data-state={row.getIsSelected() && 'selected'}
												className={cn(row.depth ? 'bg-muted/50' : '', 'relative')}
												ref={provided.innerRef}
												{...provided.draggableProps}
											>
												{row.getVisibleCells().map((cell) => (
													<>
														{cell.column.id === 'drag' ? (
															<DataTableCell
																key={cell.id}
																cell={cell}
																className='hover:opacity-100 opacity-100'
																handleProps={provided.dragHandleProps}
															/>
														) : (
															<TableCell key={cell.id}>
																{flexRender(cell.column.columnDef.cell, cell.getContext())}
															</TableCell>
														)}
													</>
												))}
											</TableRow>
										)}
									</Draggable>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={table.getAllColumns().length}
										className='h-24 text-center'
									>
										No results.
									</TableCell>
								</TableRow>
							)}
							{provided.placeholder}
						</TableBody>
					)}
				</Droppable>

				{/* <TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row, index) => <DataTableRow key={row.id} row={row} />)
					) : (
						<TableRow>
							<TableCell colSpan={table.getAllColumns().length} className='h-24 text-center'>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody> */}

				{/* <Droppable droppableId={type} type='product'>
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
				</Droppable> */}
			</Table>
		</div>
	);
}
