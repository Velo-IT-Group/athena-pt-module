'use client';

import * as React from 'react';

import { ProjectTemplateTicket } from '@/types/manage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const TicketSelector = ({ tickets }: { tickets?: ProjectTemplateTicket[] }) => {
	return (
		<Select name='service_ticket'>
			<SelectTrigger className='col-span-3' tabIndex={2}>
				<SelectValue placeholder='Select a ticket' />
			</SelectTrigger>
			<SelectContent>
				{tickets?.map((ticket) => (
					// @ts-ignore
					<SelectItem key={ticket.id} value={String(ticket.id)}>
						#{ticket.id} - {ticket.summary}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default TicketSelector;
