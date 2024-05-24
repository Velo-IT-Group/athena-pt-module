'use client';
import React from 'react';
import { TableCell, TableRow } from './table';
import { Row, flexRender } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import DataTableCell from './data-table-cell';
interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	row: Row<any>;
	ref: (element: HTMLElement | null) => void;
}

const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(({ row, className, ...props }, ref) => (
	<TableRow data-state={row.getIsSelected() && 'selected'} className={cn(row.depth ? 'bg-muted/50' : '', 'relative')} ref={ref}>
		{row.getVisibleCells().map((cell) => (
			<>
				{cell.column.id === 'drag' ? (
					<DataTableCell key={cell.id} cell={cell} className='hover:opacity-100 opacity-100' />
				) : (
					<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
				)}
			</>
		))}
	</TableRow>
));
DataTableRow.displayName = 'DataTableRow';
// function DataTableRow<T>({ row, ref }: Props<T>) {
// 	return (

// 	);
// }

export default DataTableRow;
