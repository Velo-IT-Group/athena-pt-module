'use client';
import React, { useOptimistic } from 'react';
import PhasesList from './PhasesList';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { deleteSection } from '@/lib/functions/delete';
import { updateSection } from '@/lib/functions/update';
import { PhaseState } from '@/types/optimisticTypes';

type Props = {
	section: Section;
	phases: NestedPhase[];
	pending: boolean;
};

const SectionListItem = ({ section, phases, pending }: Props) => {
	const [state, mutate] = useOptimistic({ phases, pending: false }, function createReducer(state, newState: PhaseState) {
		if (newState.newPhase) {
			return {
				phases: [...state.phases, newState.newPhase] as NestedPhase[],
				pending: newState.pending,
			};
		} else if (newState.updatedPhase) {
			return {
				phases: [...state.phases.filter((f) => f.id !== newState.updatedPhase!.id), newState.updatedPhase] as NestedPhase[],
				pending: newState.pending,
			};
		} else {
			return {
				phases: [...state.phases.filter((f) => f.id !== newState.deletedPhase)] as NestedPhase[],
				pending: newState.pending,
			};
		}
	});

	return (
		<Collapsible className='border rounded-xl overflow-hidden'>
			<div className='flex flex-row items-center gap-4 p-4 w-full bg-muted/50'>
				<Input
					readOnly={pending}
					onBlur={async (e) => {
						if (e.currentTarget.value !== section.name) {
							console.log('updating phase');
							await updateSection(section.id, { name: e.currentTarget.value });
						}
					}}
					className='border border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 min-w-60'
					defaultValue={section.name}
				/>

				<DropdownMenu>
					<DropdownMenuTrigger disabled={pending} asChild>
						<Button variant='outline' size='icon' className='ml-auto'>
							<DotsHorizontalIcon className='w-4 h-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={async () => await deleteSection(section.id)}>Delete</DropdownMenuItem>
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
				<div className='p-4 space-y-2 border-t'>
					<PhasesList phases={state.phases} id={section.id} />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};

export default SectionListItem;
