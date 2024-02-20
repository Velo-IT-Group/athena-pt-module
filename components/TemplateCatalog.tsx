'use client';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProjectTemplate } from '@/types/manage';
import TemplatePicker from './TemplatePicker';

type Props = {
	templates?: ProjectTemplate[];
};

const TemplateCatalog = ({ templates }: Props) => {
	const [text, setText] = useState<string>('');

	return (
		<div className='h-full overflow-hidden'>
			<div className='h-full flex w-full'>
				<div className='h-full w-full flex'>
					<div className='flex flex-col flex-grow py-8 px-4 bg-muted/50 space-y-2'>
						<div className='flex items-center gap-2 w-72'>
							<h2 className='font-semibold text-base'>Project Templates</h2>
						</div>
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
						<TemplatePicker templates={templates?.filter((template) => template.name.toLowerCase().includes(text)) ?? []} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default TemplateCatalog;
