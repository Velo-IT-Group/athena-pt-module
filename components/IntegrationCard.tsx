'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { ArrowTopRightIcon, GearIcon } from '@radix-ui/react-icons';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from './ui/input';
import { createOrganizationIntegration } from '@/lib/functions/create';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from './ui/dialog';

const IntegrationCard = ({
	integrations,
	integration,
	organization,
}: {
	integrations: OrganizationIntegration[];
	integration: Integration;
	organization: string;
}) => {
	const [isChecked, setIsChecked] = useState<boolean>(integrations.some((i) => i.integration === integration.id));
	const [open, setOpen] = useState<boolean>(false);

	return (
		<Card>
			<CardHeader className='flex-row justify-between'>
				<div className='border rounded-lg overflow-hidden h-8 w-8 relative'>
					<Image className='rounded-lg object-cover w-8 h-8' src={`/${integration?.logo}`} alt='Ingram logo' fill />
				</div>
				<Link
					href='https://www.ingrammicro.com/'
					target='_blank'
					className='text-muted-foreground text-xs hover:underline hover:decoration-muted-foreground'
				>
					ingrammicro.com <ArrowTopRightIcon className='inline-block' />
				</Link>
			</CardHeader>
			<CardContent className='space-y-1'>
				<h3 className='font-semibold'>{integration.name}</h3>
				<p className='text-xs text-muted-foreground'>Ingram Micro empowers technology businesses to operate more effectively and successfully.</p>
			</CardContent>
			<CardFooter className='justify-between'>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant='ghost' size='sm' className='text-muted-foreground'>
							<GearIcon className='mr-2' /> Manage
						</Button>
					</DialogTrigger>
					<DialogContent>
						<form
							action={async (data: FormData) => {
								const client_id = data.get('client_id') as string;
								await createOrganizationIntegration({ integration: integration.id, organization, client_id });
							}}
						>
							<Input name='client_id' required placeholder='••••••' />
							<DialogFooter>
								<DialogClose></DialogClose>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				<AlertDialog open={open} onOpenChange={setOpen}>
					<Switch
						onCheckedChange={() => {
							setIsChecked(!isChecked);
							setOpen(!open);
						}}
						defaultChecked={isChecked}
					/>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>{isChecked ? 'Add Integration' : 'Are you absolutely sure?'}</AlertDialogTitle>
							{!isChecked && (
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your account and remove your data from our servers.
								</AlertDialogDescription>
							)}
						</AlertDialogHeader>
						{isChecked && (
							<form
								action={async (data: FormData) => {
									const client_id = data.get('client_id') as string;
									await createOrganizationIntegration({ integration: integration.id, organization, client_id });
								}}
							>
								<Input name='client_id' required placeholder='••••••' />
								<AlertDialogFooter>
									<AlertDialogCancel onClick={() => setIsChecked(!isChecked)}>Cancel</AlertDialogCancel>
									{isChecked ? (
										<AlertDialogAction type='submit'>Continue</AlertDialogAction>
									) : (
										<AlertDialogAction type='submit'>Remove</AlertDialogAction>
									)}
								</AlertDialogFooter>
							</form>
						)}
					</AlertDialogContent>
				</AlertDialog>
			</CardFooter>
		</Card>
	);
};

export default IntegrationCard;
