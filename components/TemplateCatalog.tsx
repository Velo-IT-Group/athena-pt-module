'use client';
import React, { useState } from 'react';
import { ProjectTemplate } from '@/types/manage';
import TemplatePicker from './TemplatePicker';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import TemplateItem from './TemplateItem';

type Props = {
	templates?: ProjectTemplate[];
};

const TemplateCatalog = ({ templates }: Props) => {
	const [text, setText] = useState<string>('');

	return (
		<ScrollArea className='h-header relative'>
			<div className='flex flex-col flex-grow py-8 px-4 space-y-2'>
				<div className='flex items-center gap-2'>
					<h2 className='font-semibold text-base'>Project Templates</h2>
				</div>

				<div className={cn('space-y-2 rounded-xl')}>
					{templates?.map((template, index) => (
						<TemplateItem key={template.id} template={template} index={index} />
					))}
				</div>
				<TemplatePicker templates={templates?.filter((template) => template.name.toLowerCase().includes(text)) ?? []} />
			</div>
		</ScrollArea>
	);
};

export default TemplateCatalog;
