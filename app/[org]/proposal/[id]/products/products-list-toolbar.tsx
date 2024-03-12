'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { DataTableViewOptions } from './data-table-view-options';

// import { priorities, statuses } from '../data/data';
import { DataTableFacetedFilter } from './products-filter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getCategories, getSubCategories } from '@/lib/functions/read';
import { useEffect, useState } from 'react';
import { Category, Subcategory } from '@/types/manage';

interface ProductsListToolbarProps<TData> {
	table: Table<TData>;
}

export function ProductsListToolbar<TData>({ table }: ProductsListToolbarProps<TData>) {
	const [categories, setCategories] = useState<Category[]>([]);
	const [subCategories, setSubCategories] = useState<Subcategory[]>([]);
	const isFiltered = table.getState().columnFilters.length > 0;

	useEffect(() => {
		Promise.all([getCategories(), getSubCategories()]).then(([categoriesData, subCategoriesData]) => {
			setCategories(categoriesData);
			setSubCategories(subCategoriesData);
		});
	}, []);

	return (
		<div className='flex items-center justify-between'>
			<div className='flex flex-1 items-center space-x-2'>
				<Input
					placeholder='Filter products...'
					value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
					onChange={(event) => table.getColumn('description')?.setFilterValue(event.target.value)}
					className='h-8 w-[150px] lg:w-[250px]'
				/>
				<DataTableFacetedFilter column={table.getColumn('category')} title='Category' options={categories} />
				<DataTableFacetedFilter column={table.getColumn('subcategory')} title='Sub Categories' options={subCategories} />
				{isFiltered && (
					<Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
						Reset
						<Cross2Icon className='ml-2 h-4 w-4' />
					</Button>
				)}
			</div>
		</div>
	);
}
