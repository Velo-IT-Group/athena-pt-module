'use client';
import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, ArrowUpIcon, DotsHorizontalIcon, DragHandleDots2Icon } from '@radix-ui/react-icons';
import { handlePhaseDelete } from '@/app/actions';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import TicketsList from './TicketsList';
import { updatePhase } from '@/lib/data';

type Props = {
	phase: Phase;
	tickets: Array<Ticket & { tasks: Task[] }>;
	order: number;
	pending: boolean;
};

const PhaseListItem = ({ phase, tickets, order, pending }: Props) => {
	const [open, setOpen] = React.useState(false);
	const [collapsibleOpen, setCollapsibleOpen] = React.useState(false);

	return (
		<div>
			<Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className='space-y-2 bg-background'>
				<div className='flex w-full flex-col items-start rounded-md border p-3 sm:flex-row sm:items-center gap-2'>
					<DragHandleDots2Icon className='w-4 h-4' />

					<p className='text-sm font-medium leading-none'>
						<span className='mr-3 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground'>Phase {order}</span>
						<span
							className='text-muted-foreground border border-transparent hover:border-border hover:cursor-default rounded-xl px-2 -mx-2 py-2 -my-2'
							contentEditable
							aria-disabled={pending}
							onBlur={async (e) => {
								if (e.currentTarget.innerText !== phase.description) {
									console.log('updating phase');
									updatePhase(phase.id, { description: e.currentTarget.innerText });
								}
							}}
						>
							{phase.description}
						</span>
					</p>

					<p className='ml-auto'>
						{phase.hours}hrs
						<DropdownMenu open={open} onOpenChange={setOpen}>
							<DropdownMenuTrigger asChild disabled={pending}>
								<Button variant='ghost' size='sm'>
									<DotsHorizontalIcon />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-[200px]'>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuGroup>
									<DropdownMenuItem>Assign to...</DropdownMenuItem>
									<DropdownMenuItem>Set due date...</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuSub>
										<DropdownMenuSubTrigger>Move</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent>
												<DropdownMenuItem>
													Move Up
													<DropdownMenuShortcut>
														<ArrowUpIcon />
													</DropdownMenuShortcut>
												</DropdownMenuItem>
												<DropdownMenuItem>
													Move Down
													<DropdownMenuShortcut>
														<ArrowDownIcon />
													</DropdownMenuShortcut>
												</DropdownMenuItem>
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => handlePhaseDelete(phase.id)} className='text-red-600'>
										Delete
										<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</p>
					<CollapsibleTrigger asChild>
						<Button variant='ghost' size='sm'>
							<CaretSortIcon className='h-4 w-4' />
							<span className='sr-only'>Toggle</span>
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className='space-y-2'>
					<TicketsList phase={phase.id} tickets={tickets} />
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

export default PhaseListItem;
