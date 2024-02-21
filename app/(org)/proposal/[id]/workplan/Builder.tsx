'use client';
import TemplateCatalog from '@/components/TemplateCatalog';
import { ProjectTemplate } from '@/types/manage';
import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import SectionsList from './SectionsList';

type Props = {
	id: string;
	sections?: NestedSection[];
	templates: ProjectTemplate[];
};

const onDragEnd = (result: DropResult) => {};

const Builder = ({ id, sections, templates }: Props) => {
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='h-full'>
				<div className='flex items-start h-full'>
					<div className='border-r h-full'>
						<TemplateCatalog templates={templates ?? []} />
					</div>
					<div className='w-full h-full overflow-hidden'>
						<div className='h-full flex w-full'>
							<div className='h-full w-full flex'>
								<div className='flex flex-col flex-grow py-8 px-4 space-y-2'>
									<h1 className='text-2xl font-semibold'>Workplan</h1>
									<SectionsList sections={sections ?? []} id={id} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DragDropContext>
	);
};

export default Builder;
