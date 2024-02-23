'use client';
import { ArrowDownIcon, ArrowUpIcon, DotsHorizontalIcon, DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
import React, { useOptimistic, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { handleTicketDelete } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import TasksList from './TasksList';
import CornerDownRightIcon from '@/components/icons/CornerDownRightIcon';
import TicketForm from '@/components/forms/TicketForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { updateTicket } from '@/lib/functions/update';
import { TicketState } from '@/types/optimisticTypes';

type Props = {
	ticket: NestedTicket;
	order: number;
	pending: boolean;
	mutate: (action: TicketState) => void;
};

const TicketListItem = ({ ticket, order, pending, mutate }: Props) => {
	let [isPending, startTransition] = useTransition();

	const [open, setOpen] = React.useState(false);

	return (
		<div className='flex items-center space-x-2 pl-2 w-full'>
			<CornerDownRightIcon />

			<div className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm flex flex-1 flex-col items-start justify-between p-3 sm:flex-row sm:items-center gap-2 '>
				<div className='flex items-center flex-1 gap-2 flex-shrink-0 flex-grow'>
					<DragHandleDots2Icon className='w-4 h-4' />

					<Badge variant='secondary' className='text-nowrap'>
						Ticket {order}
					</Badge>
					<Input
						readOnly={pending}
						onBlur={(e) => {
							if (e.currentTarget.value !== ticket.summary) {
								startTransition(async () => {
									mutate({ updatedTicket: { ...ticket, summary: e.currentTarget.value }, pending: true });
									await updateTicket(ticket.id, { summary: e.currentTarget.value, phase: ticket.phase });
								});
							}
						}}
						className='border border-transparent hover:border-border hover:cursor-default shadow-none px-2'
						defaultValue={ticket.summary}
					/>
					{/* <p className='text-sm font-medium leading-none flex items-center'></p> */}
					<span className='text-muted-foreground line-clamp-1 flex-1 flex-'>{ticket.summary}</span>
				</div>

				<div className='flex items-center flex-shrink flex-grow-0'>
					<Input
						type='number'
						readOnly={pending || isPending}
						onBlur={(e) => {
							if (e.currentTarget.valueAsNumber !== ticket.budget_hours) {
								startTransition(async () => {
									mutate({ updatedTicket: { ...ticket, budget_hours: e.currentTarget.valueAsNumber }, pending: true });

									// @ts-ignore
									await updateTicket(ticket.id, { budget_hours: e.currentTarget.valueAsNumber });
								});
							}
						}}
						min={0}
						step={0.25}
						className='border border-transparent hover:border-border hover:cursor-default shadow-none px-2 max-w-20 text-right'
						defaultValue={ticket.budget_hours}
					/>
					<Dialog>
						<DropdownMenu open={open} onOpenChange={setOpen}>
							<DropdownMenuTrigger asChild>
								<Button variant='ghost' size='sm'>
									<DotsHorizontalIcon />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end' className='w-[200px]'>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuGroup>
									<DropdownMenuItem>Assign to...</DropdownMenuItem>
									<DropdownMenuItem>Set due date...</DropdownMenuItem>
									<DialogTrigger asChild>
										<DropdownMenuItem>View Details</DropdownMenuItem>
									</DialogTrigger>
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
									<DropdownMenuItem onClick={() => handleTicketDelete(ticket.id)} className='text-red-600'>
										Delete
										<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className='max-w-lg flex flex-col'>
							<ScrollArea className='max-h-[75vh]'>
								<TicketForm ticket={ticket} />
								<div>
									<h3>Tasks</h3>
									<ScrollArea>
										<TasksList tasks={ticket.tasks ?? []} ticketId={ticket.id} />
									</ScrollArea>
								</div>
							</ScrollArea>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
};

export default TicketListItem;
