import React, { useOptimistic, useRef, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton';
import { PlusIcon } from '@radix-ui/react-icons';
import { TaskState } from '@/types/optimisticTypes';
import { createTask } from '@/lib/functions/create';
import { v4 as uuid } from 'uuid';

const TasksList = ({ tasks, ticketId }: { tasks: Task[]; ticketId: string }) => {
	let formRef = useRef<HTMLFormElement>(null);
	const [isPending, startTransition] = useTransition();
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

	return (
		<div className='space-y-2'>
			{state.tasks?.map((task) => (
				<div key={task.id} className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm p-3'>
					{task.summary}
				</div>
			))}
			<form
				ref={formRef}
				action={(data: FormData) => {
					const createdTask: TaskInsert = {
						ticket: ticketId,
						notes: '',
						priority: 1,
						summary: data.get('summary') as string,
						visibile: true,
					};

					formRef.current?.reset();

					startTransition(async () => {
						mutate({
							newTask: { ...createdTask, created_at: Date(), id: uuid() },
							pending: true,
						});

						await createTask(createdTask);
					});
				}}
				className='flex items-center gap-4'
			>
				<Input name='summary' placeholder='Task summary...' />
				<SubmitButton>
					<PlusIcon className='w-4 h-4' />
				</SubmitButton>
			</form>
		</div>
	);
};

export default TasksList;
