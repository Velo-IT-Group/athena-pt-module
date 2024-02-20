'use client';
import React from 'react';
import PhasesList from './PhasesList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { handleSectionDelete } from '@/app/actions';

type Props = {
	section: Section;
	phases: Array<Phase & { tickets: Array<Ticket & { tasks: Array<Task> }> }>;
};

const SectionListItem = ({ section, phases }: Props) => {
	return (
		<Card>
			<Collapsible className='w-full'>
				<CardHeader className='flex flex-row items-center gap-4 w-full'>
					<CardTitle>{section.name}</CardTitle>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' size='icon' className='ml-auto'>
								<DotsHorizontalIcon className='w-4 h-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => handleSectionDelete(section.id)}>Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<CollapsibleTrigger asChild>
						<Button variant='ghost' size='sm'>
							<CaretSortIcon className='h-4 w-4' />
							<span className='sr-only'>Toggle</span>
						</Button>
					</CollapsibleTrigger>
				</CardHeader>

				<CollapsibleContent>
					<CardContent>
						<div className='space-y-2'>
							{phases && phases.length ? <PhasesList phases={phases} id={section.id} /> : <div className='p-8 rounded-xl bg-muted'></div>}
						</div>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
};

export default SectionListItem;
