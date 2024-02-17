'use client';
import { ArrowDownIcon, ArrowUpIcon, DotsHorizontalIcon, DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import React from 'react';
import { Button } from '@/components/ui/button';
import { handleTicketDelete } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import TasksList from './TasksList';
import CornerDownRightIcon from './CornerDownRightIcon';
import TicketForm from './TicketForm';

type Props = {
	ticket: Ticket & { tasks: Task[] };
	order: number;
};

const TicketListItem = ({ ticket, order }: Props) => {
	const [open, setOpen] = React.useState(false);

	return (
		<div className='flex items-center space-x-2 pl-2 w-full'>
			<CornerDownRightIcon />

			<div className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm flex w-full flex-col items-start p-3 sm:flex-row sm:items-center gap-2'>
				<DragHandleDots2Icon className='w-4 h-4' />

				<p className='text-sm font-medium leading-none'>
					<Badge variant='secondary' className='mr-2'>
						Ticket {order}
					</Badge>
					<span className='text-muted-foreground'>{ticket.summary}</span>
				</p>

				<p className='ml-auto space-x-2'>
					<span>{ticket.budget_hours}</span>
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
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{ticket.summary}</DialogTitle>
							</DialogHeader>
							<TicketForm ticket={ticket} />
							{/* <div className='space-y-4'>
								<Input defaultValue={ticket.summary} />
								<h2 className='text-lg font-medium'>Tasks</h2>
								<TasksList tasks={ticket.tasks} ticketId={ticket.id} />
							</div> */}
							<DialogFooter>
								<Button type='submit'>Confirm</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</p>
			</div>
		</div>
	);
};

export default TicketListItem;
