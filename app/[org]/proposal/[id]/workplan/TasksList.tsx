import React from 'react';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton';
import { PlusIcon } from '@radix-ui/react-icons';
import { handleTaskInsert } from '@/app/actions';

const TasksList = ({ tasks, ticketId }: { tasks: Task[]; ticketId: string }) => {
	return (
		<>
			{tasks?.map((task) => (
				<div key={task.id} className='rounded-md border px-4 py-2 font-mono text-sm shadow-sm p-3'>
					{task.summary}
				</div>
			))}
			<form action={handleTaskInsert} className='flex items-center gap-4'>
				<Input name='ticket' defaultValue={ticketId} readOnly hidden className='hidden' />
				<Input name='summary' placeholder='Task summary...' />
				<Input name='priority' value={1} readOnly hidden className='hidden' />
				<Input name='notes' readOnly hidden className='hidden' />
				<SubmitButton>
					<PlusIcon className='w-4 h-4' />
				</SubmitButton>
			</form>
		</>
	);
};

export default TasksList;
