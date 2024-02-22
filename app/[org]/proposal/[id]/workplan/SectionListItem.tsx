'use client';
import React from 'react';
import PhasesList from './PhasesList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { handleSectionDelete, handleSectionNameUpdate } from '@/app/actions';

type Props = {
	section: Section;
	phases: NestedPhase[];
	pending: boolean;
};

const SectionListItem = ({ section, phases, pending }: Props) => {
	return (
		<Collapsible className='w-full border rounded-xl p-4 space-y-4'>
			<div className='flex flex-row items-center gap-4 w-full'>
				<h3
					contentEditable
					onBlur={async (e) => {
						if (e.currentTarget.innerText !== section.name) {
							console.log('updating phase');
							await handleSectionNameUpdate(section.id, e.currentTarget.innerText);
						}
					}}
					className='border border-transparent hover:border-border hover:cursor-default rounded-xl px-2 -mx-2 py-2 -my-2 min-w-60'
				>
					{section.name}
				</h3>
				<DropdownMenu>
					<DropdownMenuTrigger disabled={pending} asChild>
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
			</div>

			<CollapsibleContent>
				<div className='space-y-2'>
					<PhasesList phases={phases ?? []} id={section.id} />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};

export default SectionListItem;
