'use client';
import React, { useEffect, useRef } from 'react';
import { TableCell, TableRow } from './table';
import { Row, flexRender } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import DataTableCell from './data-table-cell';
import { Draggable } from 'react-beautiful-dnd';

type Props<T> = {
	row: Row<T>;
	ref: (element: HTMLElement | null) => void;
};

function DataTableRow<T>({ row, ref }: Props<T>) {
	const testingRef = useRef<HTMLTableRowElement>(null);

	useEffect(() => {
		if (!testingRef.current) return;

		ref(testingRef.current);
	}, [ref]);

	return (
		<TableRow ref={testingRef} data-state={row.getIsSelected() && 'selected'} className={cn(row.depth ? 'bg-muted/50' : '', 'relative')} draggable>
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
	);
}

export default DataTableRow;
