'use client';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProjectTemplate } from '@/types/manage';
import TemplatePicker from './TemplatePicker';
import { ScrollArea } from './ui/scroll-area';

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
				{/* <div className='grid gap-2 sticky top-2'>
					<Label className='sr-only' htmlFor='search'>
						Search
					</Label>
					<Input
						className='bg-background rounded-xl'
						id='search'
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder='Search templates...'
					/>
				</div> */}
				<TemplatePicker templates={templates?.filter((template) => template.name.toLowerCase().includes(text)) ?? []} />
			</div>
		</ScrollArea>
	);
};

export default TemplateCatalog;
