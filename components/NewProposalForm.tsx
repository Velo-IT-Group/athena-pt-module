import React from 'react';
import { ProjectTemplate } from '@/types/manage';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import SubmitButton from './SubmitButton';
import { Label } from './ui/label';
import { handleProposalInsert } from '@/app/actions';

type Props = {
	templates: Array<ProjectTemplate>;
};

const NewProposalForm = ({ templates }: Props) => {
	return (
		<form action={handleProposalInsert} className='space-y-8'>
			<div>
				<Label htmlFor='name'>Name</Label>
				<Input id='name' name='name' placeholder='Name' tabIndex={1} />
			</div>

			<div>
				<Label htmlFor='project_templates'>Project Template</Label>
				<Select>
					<SelectTrigger tabIndex={2}>
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

			<SubmitButton tabIndex={3}>Submit</SubmitButton>
		</form>
	);
};

export default NewProposalForm;
