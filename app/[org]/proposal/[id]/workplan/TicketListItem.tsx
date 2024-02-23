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
import TasksList from './TasksList';
import CornerDownRightIcon from '@/components/icons/CornerDownRightIcon';
import TicketForm from '@/components/forms/TicketForm';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
	ticket: Ticket & { tasks: Task[] };
	order: number;
};

const TicketListItem = ({ ticket, order }: Props) => {
	const [open, setOpen] = React.useState(false);

	return (
		<div className='flex items-center space-x-2 pl-2 w-full'>
			<CornerDownRightIcon />

			<div className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm flex flex-1 flex-col items-start justify-between p-3 sm:flex-row sm:items-center gap-2'>
				<div className='flex items-center flex-1 gap-2'>
					<DragHandleDots2Icon className='w-4 h-4' />

					<Badge variant='secondary' className='text-nowrap'>
						Ticket {order}
					</Badge>
					{/* <p className='text-sm font-medium leading-none flex items-center'></p> */}
					<span className='text-muted-foreground line-clamp-1 flex-1 flex-'>{ticket.summary}</span>
				</div>

				<p className='space-x-2'>
					<span>{ticket.budget_hours}hrs</span>
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
				</p>
			</div>
		</div>
	);
};

export default TicketListItem;
