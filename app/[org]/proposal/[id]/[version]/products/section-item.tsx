'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DraggableDataTable } from '@/components/ui/draggable-data-table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Draggable } from 'react-beautiful-dnd';
import { columns } from './columns';

type Props = {
	section: NestedSection;
	href: string;
	isCurrent: boolean;
	index: number;
};

const SectionItem = ({ section, href, isCurrent, index }: Props) => {
	const table = useReactTable({
		data: section?.products ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Draggable draggableId={`section-${section.id}`} index={index}>
			{(provided) => (
				<Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
					<CardHeader>
						<CardTitle>{section.name}</CardTitle>
					</CardHeader>
					<CardContent>
						<DraggableDataTable table={table}></DraggableDataTable>
					</CardContent>
				</Card>
			)}
		</Draggable>
	);
};

export default SectionItem;
