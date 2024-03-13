'use client';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateHomeSortCookie } from '@/lib/functions/update';

type Props = {
	defaultValue?: string;
};

const SortSelector = ({ defaultValue = 'name' }: Props) => {
	return (
		<Select defaultValue={defaultValue} onValueChange={updateHomeSortCookie}>
			<SelectTrigger className='w-48 bg-background'>
				<SelectValue placeholder='Sort by' />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='updated_at'>Sort by activity</SelectItem>
				<SelectItem value='name'>Sort by name</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default SortSelector;
