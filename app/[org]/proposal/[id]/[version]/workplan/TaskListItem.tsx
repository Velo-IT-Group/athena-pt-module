'use client';
import { DotsHorizontalIcon, DragHandleDots2Icon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CornerDownRightIcon from '@/components/icons/CornerDownRightIcon';
import { updateTask } from '@/lib/functions/update';
import { TaskState } from '@/types/optimisticTypes';
import { deleteTask } from '@/lib/functions/delete';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type Props = {
	task: Task;
	order: number;
	pending: boolean;
	taskMutation: (action: TaskState) => void;
};

const TaskListItem = ({ task, order, pending, taskMutation }: Props) => {
	let [isPending, startTransition] = useTransition();

	const [open, setOpen] = React.useState(false);

	return (
		<div className='flex items-center space-x-2 pl-2 w-full'>
			<CornerDownRightIcon />

			<div className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm flex flex-1 flex-col items-start justify-between p-3 sm:flex-row sm:items-center gap-2 '>
				<div className='flex items-start flex-1 gap-2 flex-shrink-0 flex-grow'>
					<DragHandleDots2Icon className='w-4 h-4 mt-2' />

					<Badge
						variant='secondary'
						className='flex-shrink-0 mt-2'
					>
						Task {order}
					</Badge>
					<Textarea
						readOnly={pending}
						onBlur={(e) => {
							if (e.currentTarget.value !== task.notes) {
								startTransition(async () => {
									taskMutation({ updatedTask: { ...task, notes: e.currentTarget.value }, pending: true });
									await updateTask(task.id, { notes: e.currentTarget.value });
								});
								toast('Task has been updated!', {
									description: Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date()),
								});
							}
						}}
						className='border border-transparent hover:border-border hover:cursor-default shadow-none px-2'
						defaultValue={task.notes}
					/>
					<span className='text-muted-foreground line-clamp-1 flex-1 flex-'>{task.notes}</span>
				</div>

				<div className='flex flex-shrink flex-grow-0'>
					<Dialog>
						<DropdownMenu
							open={open}
							onOpenChange={setOpen}
						>
							<DropdownMenuTrigger asChild>
								<Button
									variant='ghost'
									size='sm'
								>
									<DotsHorizontalIcon />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align='end'
								className='w-[200px]'
							>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuGroup>
									<DialogTrigger asChild>
										<DropdownMenuItem>View Details</DropdownMenuItem>
									</DialogTrigger>

									<DropdownMenuItem
										onClick={() => {
											startTransition(async () => {
												taskMutation({ deletedTask: task.id, pending: true });
												await deleteTask(task.id);
											});
										}}
										className='text-red-600'
									>
										Delete
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className='max-w-lg flex flex-col'></DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
};

export default TaskListItem;
