'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateTicket } from '@/lib/functions/update';
import SubmitButton from '@/components/SubmitButton';
import { Textarea } from '../ui/textarea';
import { DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

const formSchema = z.object({
	summary: z.string(),
	notes: z.string().optional(),
	budget_hours: z.number().min(0),
});

const TicketForm = ({ ticket }: { ticket: Ticket }) => {
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			summary: ticket?.summary ?? '',
			// phase: ticket?.phase ?? '',
			budget_hours: ticket?.budget_hours ?? 0,
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		// formData.set
		await updateTicket(ticket.id, { summary: values.summary ?? '', phase: ticket.phase, budget_hours: values.budget_hours ?? 0 });
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle>{ticket.summary}</DialogTitle>
			</DialogHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<Input name='id' defaultValue={ticket.id} hidden className='hidden' />
					<FormField
						control={form.control}
						name='summary'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Summary</FormLabel>
								<FormControl>
									<Textarea placeholder='Tell us a little bit about yourself' className='resize-y' {...field} />
									{/* <Input placeholder='shadcn' {...field} /> */}
								</FormControl>
								<FormDescription>This is your public display name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* <FormField
						control={form.control}
						name='phase'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder={field.value ?? 'Select a verified email to display'} />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value='m@example.com'>m@example.com</SelectItem>
										<SelectItem value='m@google.com'>m@google.com</SelectItem>
										<SelectItem value='m@support.com'>m@support.com</SelectItem>
									</SelectContent>
								</Select>
								<FormDescription>
									You can manage email addresses in your <Link href='/examples/forms'>email settings</Link>.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/> */}
					<FormField
						control={form.control}
						name='budget_hours'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Budget Hours</FormLabel>
								<FormControl>
									<Input min={0} type='number' placeholder='0hrs' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<DialogFooter>
						<SubmitButton>Submit</SubmitButton>
					</DialogFooter>
				</form>
			</Form>
		</>
	);
};

export default TicketForm;
