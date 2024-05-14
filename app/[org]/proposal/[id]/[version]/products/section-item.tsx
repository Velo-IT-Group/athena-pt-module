import React, { useEffect, useRef, useState } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { BaseEventPayload, DropTargetLocalizedData, ElementDragType } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';

type Props = {
	section: Section;
	href: string;
	isCurrent: boolean;
	isDraggingOver: boolean;
	setIsDraggingOver: React.Dispatch<React.SetStateAction<boolean>>;
};

type DraggableState = 'idle' | 'generate-preview' | 'dragging';

const SectionItem = ({ section, href, isCurrent, isDraggingOver, setIsDraggingOver }: Props) => {
	const ref = useRef<HTMLAnchorElement | null>(null);
	const [state, setState] = useState<DraggableState>('idle');
	const [isExternalDrag, setIsExternalDrag] = useState<boolean>(false);

	function getColor(isDraggedOver: boolean): string {
		if (isDraggedOver) {
			return 'bg-blue-100';
		}
		return 'bg-muted';
	}

	function getDragState(e: BaseEventPayload<ElementDragType> & DropTargetLocalizedData) {
		if (e.self.data.type === e.source.data.type) {
			setIsDraggingOver(!isDraggingOver);
		} else {
			setIsExternalDrag(!isExternalDrag);
		}
	}

	useEffect(() => {
		invariant(ref.current);

		return combine(
			draggable({
				element: ref.current,
				getInitialData: () => ({ type: 'section', sectionId: section.id }),
				onGenerateDragPreview: ({ source }) => {
					setState('generate-preview');
				},
				onDragStart: () => setState('dragging'),
				onDrop: () => setState('idle'),
			}),
			dropTargetForElements({
				element: ref.current,
				getData: () => ({ type: 'section', sectionId: section.id }),
				getIsSticky: () => true,
				onDragEnter: (e) => getDragState(e),
				onDragLeave: (e) => getDragState(e),
				onDragStart: (e) => getDragState(e),
				onDrop: (e) => getDragState(e),
			})
		);
	}, [section.id, setIsDraggingOver, getDragState]);

	return (
		<Link
			href={href}
			className={cn(
				'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
				isCurrent && 'bg-background text-foreground shadow',
				state === 'dragging' && 'opacity-60',
				getColor(isExternalDrag)
			)}
			ref={ref}
		>
			{section.name}
		</Link>
	);
};

export default SectionItem;
