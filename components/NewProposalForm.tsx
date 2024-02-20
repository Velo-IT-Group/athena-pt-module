'use client';
import React, { useEffect, useState } from 'react';
import { ProjectTemplate, ProjectTemplateTicket } from '@/types/manage';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton';
import { Label } from '@/components/ui/label';
import { handleProposalInsert } from '@/app/actions';
import TicketSelector from './TicketSelector';

type Props = {
	templates: ProjectTemplate[];
	tickets: ProjectTemplateTicket[];
};

const NewProposalForm = ({ templates, tickets }: Props) => {
	return (
		<form action={handleProposalInsert} className='space-y-8'>
			<div>
				<Label htmlFor='name'>Name</Label>
				<Input id='name' name='name' placeholder='Name' tabIndex={1} />
			</div>

			<div className='w-full'>
				<Label htmlFor='service_ticket'>Service Ticket</Label>
				<TicketSelector tickets={tickets ?? []} />
			</div>

			<div>
				<Label htmlFor='project_templates'>Project Template</Label>
				{/* <select multiple name='templates_used'>
					{templates.map((template) => (
						<option key={template.id} value={String(template.id)}>
							{template.name}
						</option>
					))}
				</select> */}
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

			<SubmitButton tabIndex={4}>Submit</SubmitButton>
		</form>
	);
};

export default NewProposalForm;
