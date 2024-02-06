'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProjectTemplate } from '@/types';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useRouter } from 'next/navigation';
import { ReloadIcon } from '@radix-ui/react-icons';

type Props = {
	templates: Array<ProjectTemplate>;
};

const NewProposalForm = ({ templates }: Props) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const templateIds = templates.flatMap((template) => String(template.id));
	const formSchema = z.object({
		name: z
			.string()
			.min(2, 'Name should have atleast 2 alphabets')
			.max(50, 'Name should be no more than 50 characters')
			.refine((value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value)),
		// type: z.enum(templateIds).optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setLoading(true);

		console.log(values);
		const res = await fetch(`http://localhost:3000/api/proposal/submit`, { method: 'POST', body: JSON.stringify(values) });
		const { proposal } = await res.json();

		console.log(proposal);

		router.push(`/proposal/${proposal.id}`);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder='Velo - Tool' {...field} />
							</FormControl>
							<FormDescription>This is the public name of the proposal.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* <FormField
					control={form.control}
					name='type'
					render={({ field }) => (
						<FormItem className='space-y-4'>
							<FormLabel>Templates</FormLabel>
							<FormControl>
								<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
									{templates.map((template) => (
										<FormItem key={template.id} className='flex items-center space-x-2 space-y-0'>
											<FormControl>
												<RadioGroupItem value={String(template.id)} />
											</FormControl>
											<FormLabel className='font-normal'>{template.name}</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}
				<Button type='submit' disabled={loading}>
					{loading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
					{loading ? 'Please wait' : 'Submit'}
				</Button>
			</form>
		</Form>
	);
};

export default NewProposalForm;
