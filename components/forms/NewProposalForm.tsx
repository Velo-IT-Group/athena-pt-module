'use client';
import React, { useState } from 'react';
import type { ProjectTemplate, ServiceTicket } from '@/types/manage';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
	templates: ProjectTemplate[];
	tickets: ServiceTicket[];
};

const NewProposalForm = ({ templates, tickets }: Props) => {
	const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | undefined>();

	return (
		<div className='space-y-8'>
			<div className='w-full'>
				<Label htmlFor='service_ticket'>Service Ticket</Label>
				<Select
					name='service_ticket'
					onValueChange={(e) => {
						setSelectedTicket(tickets.find((ticket) => ticket.id.toString() === e));
					}}
				>
					<SelectTrigger className='col-span-3' tabIndex={2}>
						<SelectValue placeholder='Select a ticket' defaultValue={String(selectedTicket?.id)} />
					</SelectTrigger>
					<SelectContent>
						{tickets.map((ticket) => (
							<SelectItem key={ticket.id} value={String(ticket.id)}>
								#{ticket.id} - {ticket.summary}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label htmlFor='name'>Name</Label>
				<Input
					id='name'
					name='name'
					placeholder='Name'
					defaultValue={selectedTicket ? `#${selectedTicket.id} - ${selectedTicket.summary}` : ''}
					tabIndex={1}
				/>
			</div>

			<div>
				<Label htmlFor='project_templates'>Project Template</Label>

				<Select name='templates_used'>
					<SelectTrigger tabIndex={3}>
						<SelectValue placeholder='Select a template' />
					</SelectTrigger>

					<SelectContent>
						<SelectGroup>
							{templates.map((template) => (
								<SelectItem key={template.id} value={String(template.id)}>
									{template.name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};

export default NewProposalForm;
