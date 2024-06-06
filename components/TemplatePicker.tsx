'use client';
import React from 'react';
import { ProjectTemplate } from '@/types/manage';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { cn, getBackgroundColor } from '@/lib/utils';
import TemplateItem from './TemplateItem';

type Props = {
	templates: Array<ProjectTemplate>;
};

const TemplatePicker = ({ templates }: Props) => {
	return (
		<Droppable droppableId='templates' type='group'>
			{(provided, snapshot) => (
				<div {...provided.droppableProps} ref={provided.innerRef} className={cn('space-y-2 rounded-xl', getBackgroundColor(snapshot))}>
					{templates.map((template, index) => (
						<div key={template.id}>
							<TemplateItem template={template} index={index} />
						</div>
					))}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
};

export default TemplatePicker;
