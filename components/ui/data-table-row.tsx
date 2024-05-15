'use client';
import React, { useEffect, useRef, useState } from 'react';
import { TableCell, TableRow } from './table';
import { Row, flexRender } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { BaseEventPayload, DropTargetLocalizedData, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { attachClosestEdge, Edge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import invariant from 'tiny-invariant';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import DataTableCell from './data-table-cell';

type Props<T> = {
	row: Row<T>;
};

function DataTableRow<T>({ row }: Props<T>) {
	const ref = useRef<HTMLTableRowElement>(null);
	const dragHandleRef = useRef<HTMLTableCellElement>(null);
	const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
	const [isDraggingOver, setIsDraggingOver] = useState(false);

	function getDragState(e: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) {
		if (e.self.data.type === e.source.data.type) {
			setIsDraggingOver(!isDraggingOver);
			setClosestEdge(extractClosestEdge(e.self.data));
		} else {
			// setIsExternalDrag(!isExternalDrag);
		}
	}

	useEffect(() => {
		invariant(ref.current);
		if (dragHandleRef.current) {
			invariant(dragHandleRef.current);
		}

		return combine(
			draggable({
				element: ref.current,
				dragHandle: dragHandleRef.current ?? undefined,
				getInitialData: () => ({ type: 'row' }),
				onGenerateDragPreview: ({ source }) => {
					// setState('generate-preview');
				},
			}),
			dropTargetForElements({
				element: ref.current,
				getData: ({ input, element }) => {
					const data = { type: 'row' };

					return attachClosestEdge(data, {
						input,
						element,
						allowedEdges: ['top', 'bottom'],
					});
				},
				canDrop: (args) => args.source.data.type === 'product',
				getIsSticky: () => true,
				onDragEnter: (e) => getDragState(e),
				onDragLeave: (e) => {
					getDragState(e);
					setClosestEdge(null);
				},
				onDragStart: (e) => getDragState(e),
				onDrop: (e) => {
					getDragState(e);
					setClosestEdge(null);
				},
			})
		);
	}, []);

	return (
		<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className={cn(row.depth ? 'bg-muted/50' : '', 'relative')} ref={ref}>
			{row.getVisibleCells().map((cell) => (
				<>
					{cell.column.id === 'drag' ? (
						<DataTableCell key={cell.id} cell={cell} ref={dragHandleRef} className='hover:opacity-100 opacity-100' />
					) : (
						<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
					)}
				</>
			))}
			{closestEdge && <DropIndicator edge={closestEdge} />}
		</TableRow>
	);
}

export default DataTableRow;
