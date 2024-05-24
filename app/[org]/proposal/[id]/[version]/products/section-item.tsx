'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DraggableDataTable } from '@/components/ui/draggable-data-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Draggable, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { columns } from './columns';

type Props = {
	section: NestedSection;
	dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

const SectionItem = ({ section, dragHandleProps }: Props) => {
	const table = useReactTable({
		data: section?.products ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle {...dragHandleProps}>{section.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<DraggableDataTable table={table} type={section.id} />
			</CardContent>
		</Card>
	);
};

export default SectionItem;
