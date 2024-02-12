'use client';
import React from 'react';
import TicketListItem from './TicketListItem';
import { Input } from './ui/input';
import { PlusIcon } from '@radix-ui/react-icons';
import SubmitButton from './SubmitButton';
import { handleTicketInsert } from '@/app/actions';

type Props = {
	phase: string;
	tickets: Array<Ticket>;
};

const TicketsList = ({ phase, tickets }: Props) => {
	return (
		<div className='space-y-2'>
			<div className='bg-muted rounded-xl p-4 space-y-2'>
				{tickets.map((ticket: Ticket) => (
					<TicketListItem key={ticket.id} ticket={ticket} />
				))}
			</div>

			<form action={handleTicketInsert} className='flex items-center gap-2'>
				<Input name='summary' placeholder='Ticket name...' />
				<Input name='phase' value={phase} hidden className='hidden' />
				<Input type='number' name='order' value={tickets.length + 1} hidden className='hidden' />
				<SubmitButton>
					<PlusIcon className='w-4 h-4' />
				</SubmitButton>
			</form>
		</div>
	);
};

export default TicketsList;
