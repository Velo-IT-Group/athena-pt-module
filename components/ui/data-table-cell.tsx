import React, { forwardRef } from 'react';
import { TableCell } from './table';
import { Cell, flexRender } from '@tanstack/react-table';

export interface TableCellProps extends React.TableHTMLAttributes<HTMLTableCellElement> {
	cell: Cell<any, any>;
}

const DataTableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ cell, className }, ref) => {
	return (
		<TableCell key={cell.id} className={className} ref={ref}>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</TableCell>
	);
});
DataTableCell.displayName = 'DataTableCell';

export default DataTableCell;
