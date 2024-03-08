'use client';
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import RoleSelector from './role-selector';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const memberColumns: ColumnDef<Member>[] = [
	{
		accessorKey: 'full_name',
		cell: ({ row }) => <span>{row.getValue('full_name')}</span>,
	},
	{
		id: 'actions',
		cell: ({ row }) => (
			<div className='flex items-center gap-4 text-right justify-end'>
				<RoleSelector role='admin' />
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant='ghost' size='icon' className='hover:text-red-400 hover:bg-red-950'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='16'
									height='16'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									stroke-width='1.5'
									stroke-linecap='round'
									stroke-linejoin='round'
									className='feather feather-user-minus '
								>
									<path d='M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'></path>
									<circle cx='8.5' cy='7' r='4'></circle>
									<line x1='23' y1='11' x2='17' y2='11'></line>
								</svg>
							</Button>
						</TooltipTrigger>
						<TooltipContent className='bg-muted text-muted-foreground'>
							<p>Add to library</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		),
	},
];
