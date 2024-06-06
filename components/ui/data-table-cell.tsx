import React, { forwardRef } from 'react';
import { TableCell } from './table';
import { Cell, flexRender } from '@tanstack/react-table';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

export interface TableCellProps extends React.TableHTMLAttributes<HTMLTableCellElement> {
	cell: Cell<any, any>;
	handleProps?: DraggableProvidedDragHandleProps | null;
}

const DataTableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ cell, className, handleProps }, ref) => {
	return (
		<TableCell key={cell.id} className={className} ref={ref} {...handleProps}>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</TableCell>
	);
});
DataTableCell.displayName = 'DataTableCell';

export default DataTableCell;
