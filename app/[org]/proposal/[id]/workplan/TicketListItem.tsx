'use client';
import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, DotsHorizontalIcon, DragHandleDots2Icon, PlusIcon } from '@radix-ui/react-icons';
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
import { v4 as uuid } from 'uuid';
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
import { TaskState, TicketState } from '@/types/optimisticTypes';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { deleteTicket } from '@/lib/functions/delete';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { createTask } from '@/lib/functions/create';

type Props = {
	ticket: NestedTicket;
	tasks: Task[];
	order: number;
	pending: boolean;
	ticketMutation: (action: TicketState) => void;
};

const TicketListItem = ({ ticket, tasks, order, pending, ticketMutation }: Props) => {
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = React.useState(false);
	const [collapsibleOpen, setCollapsibleOpen] = React.useState(false);

	const [state, mutate] = useOptimistic({ tasks, pending: false }, function createReducer(state, newState: TaskState) {
		if (newState.newTask) {
			return {
				tasks: [...state.tasks, newState.newTask] as Task[],
				pending: newState.pending,
			};
		} else if (newState.updatedTask) {
			return {
				tasks: [...state.tasks.filter((f) => f.id !== newState.updatedTask!.id), newState.updatedTask] as Task[],
				pending: newState.pending,
			};
		} else {
			return {
				tasks: [...state.tasks.filter((f) => f.id !== newState.deletedTask)] as Task[],
				pending: newState.pending,
			};
		}
	});

	const taskStub: Task = {
		id: uuid(),
		summary: 'New Ticket',
		notes: '',
		priority: 1,
		ticket: ticket.id,
		created_at: new Date().toISOString(),
	};

	const action = async (data: FormData) => {
		const newTask = { ...taskStub, summary: 'New Ticket' };
		data.set('ticket', ticket.id);

		startTransition(async () => {
			mutate({ newTask, pending: true });

			// @ts-ignore
			delete newTicket['id'];

			await createTask(newTask);
		});
	};

	return (
		<div>
			<Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className='space-y-2 bg-background'>
				<div className='flex w-full flex-col items-start rounded-md border p-3 sm:flex-row sm:items-center gap-4'>
					<DragHandleDots2Icon className='w-4 h-4' />

					<div className='flex items-center gap-2 flex-1'>
						<p className='flex-shrink-0 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground text-nowrap font-medium leading-none'>
							Ticket {order}
						</p>

						<Input
							readOnly={pending}
							onBlur={async (e) => {
								if (e.currentTarget.value !== ticket.summary) {
									// @ts-ignore
									await updateTicket(ticket.id, { summary: e.currentTarget.value });
								}
							}}
							className='flex-grow border border-transparent hover:border-border hover:cursor-default shadow-none px-2 flex-1 w-auto'
							defaultValue={ticket.summary}
						/>
					</div>

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
								<DropdownMenuItem
									onClick={() => {
										startTransition(async () => {
											ticketMutation({ deletedTicket: ticket.id, pending: true });
											await deleteTicket(ticket.id);
										});
									}}
									className='text-red-600'
								>
									Delete
									<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
					<CollapsibleTrigger asChild>
						<Button variant='ghost' size='sm'>
							<CaretSortIcon className='h-4 w-4' />
							<span className='sr-only'>Toggle</span>
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className='space-y-2'>
					<div className='w-full flex flex-col space-y-2'>
						<Droppable droppableId='tickets' type={`droppableSubItem`}>
							{(provided) => (
								<div ref={provided.innerRef} className='space-y-2 w-full'>
									{tasks.map((task, index) => (
										<Draggable key={task.id} draggableId={task.id} index={index}>
											{(provided) => {
												return (
													<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
														{/* <TicketListItem key={ticket.id} ticket={ticket} order={index + 1} pending={state.pending} ticketMutation={mutate} /> */}
													</div>
												);
											}}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
						<form action={action} className='mx-auto'>
							<Button size='sm'>
								<PlusIcon className='w-4 h-4 mr-2' />
								Add Task
							</Button>
						</form>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

export default TicketListItem;
