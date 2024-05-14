import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import React, { useEffect, useRef, useState } from 'react';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import { cn } from '@/lib/utils';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { Button } from '@/components/ui/button';

type Props = {
	id: string;
};

const ProductDragHandler = ({ id }: Props) => {
	const ref = useRef<HTMLButtonElement | null>(null);
	const [state, setState] = useState<boolean>(false);

	useEffect(() => {
		invariant(ref.current);

		return combine(
			draggable({
				element: ref.current,
				getInitialData: () => ({ type: 'product', productId: id }),
				onGenerateDragPreview: ({ source }) => {
					// setState('generate-preview');
				},
				// onDragStart: () => setState('dragging'),
				// onDrop: () => setState('idle'),
			}),
			dropTargetForElements({
				element: ref.current,
				getData: () => ({ type: 'product', productId: id }),
				getIsSticky: () => true,
				// onDragEnter: () => setIsDraggingOver(true),
				// onDragLeave: () => setIsDraggingOver(false),
				// onDragStart: () => setIsDraggingOver(true),
				// onDrop: () => setIsDraggingOver(false),
			})
		);
	}, [id]);

	return (
		<Button ref={ref} size='icon' variant={'ghost'}>
			<DragHandleDots2Icon className='w-4 h-4' />
		</Button>
	);
};

export default ProductDragHandler;
