'use client';
import { CaretSortIcon, CubeIcon, FileTextIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ScrollArea } from './ui/scroll-area';
import { ProjectTemplate } from '@/types/manage';
import TemplatePicker from './TemplatePicker';

type Props = {
	templates: ProjectTemplate[];
};

const TemplateCatalog = ({ templates }: Props) => {
	const [text, setText] = useState<string>('');

	return (
		<Collapsible>
			<div className='flex items-center gap-2 w-full'>
				<FileTextIcon className='h-4 w-4' />
				<h2 className='font-semibold text-base'>Project Templates</h2>
				<CollapsibleTrigger asChild>
					<Button variant='ghost' size='sm' className='ml-auto'>
						<CaretSortIcon className='h-4 w-4' />
						<span className='sr-only'>Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>

			<CollapsibleContent className='h-full'>
				<div className='grid w-full items-start py-6 gap-4 text-sm dark:border-gray-800'>
					<div className='grid gap-2'>
						<Label className='sr-only' htmlFor='search'>
							Search
						</Label>
						<Input
							className='bg-white shadow-none dark:bg-gray-950'
							id='search'
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder='Search templates...'
						/>
					</div>
					<ScrollArea className='h-96 flex flex-col'>
						<TemplatePicker templates={templates.filter((template) => template.name.toLowerCase().includes(text))} />
						{/* {templates
							.filter((template) => template.name.toLowerCase().includes(text))
							.map((template) => (
								<Button key={template.id} variant='ghost' className='block'>
									{template.name}
								</Button>
							))} */}
					</ScrollArea>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};

export default TemplateCatalog;
