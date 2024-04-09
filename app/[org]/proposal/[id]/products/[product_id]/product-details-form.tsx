'use client';
import SubmitButton from '@/components/SubmitButton';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateProduct } from '@/lib/functions/update';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
	description: z.string().min(2).max(50),
	notes: z.string().max(150).optional(),
	section: z.nullable(z.string().optional()),
});

type Props = {
	product: Product;
	sections: Section[];
};

const ProductDetailsForm = ({ product, sections }: Props) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: product?.description ?? undefined,
			notes: '',
			section: product?.section,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
		delete values['notes'];

		await updateProduct(product.unique_id, values);
	}

	return (
		<CardContent>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='grid gap-6'>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder='Product name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='notes'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notes</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.'
											className='min-h-32'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='section'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Section</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select a section...' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sections.map((section) => (
												<SelectItem key={section.id} value={section.id}>
													{section.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<SubmitButton>Save</SubmitButton>
				</form>
			</Form>
		</CardContent>
	);
};

export default ProductDetailsForm;
