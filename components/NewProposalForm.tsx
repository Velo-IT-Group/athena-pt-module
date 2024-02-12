import React from 'react';
import { ProjectTemplate } from '@/types/manage';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { z } from 'zod';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import SubmitButton from './SubmitButton';
import { revalidatePath, revalidateTag } from 'next/cache';
import { Label } from './ui/label';

type Props = {
	templates: Array<ProjectTemplate>;
};

const NewProposalForm = ({ templates }: Props) => {
	async function handleSubmit(formData: FormData) {
		'use server';
		const supabase = createClient();
		const name = formData.get('name') as string;
		const templates_used = formData.get('templates_used') as string;

		const { data: proposal, error } = await supabase
			.from('proposals')
			.insert({ name, templates_used: [parseInt(templates_used)] })
			.select('*')
			.single();

		if (!!!proposal || error) {
			return redirect(`/proposal/new?message=${error}`);
		}

		revalidateTag('proposals');

		redirect(`/proposal/${proposal.id}`);
	}

	return (
		<form action={handleSubmit} className='space-y-8'>
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
