import React from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { GearIcon } from '@radix-ui/react-icons';
import { getProposal, updateProposal } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { revalidateTag } from 'next/cache';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

type Props = {
	params: { id: string };
	children: React.ReactNode;
};

const ProposalIdLayout = async ({ params, children }: Props) => {
	const { id } = params;
	const proposal = await getProposal(id);

	if (!proposal) return <div></div>;

	const handleProposal = async (formData: FormData) => {
		'use server';
		const name = formData.get('name') as string;
		const labor_rate = formData.get('labor_rate') as unknown as number;
		await updateProposal(proposal.id, { name, labor_rate });
		revalidateTag('proposals');
	};

	return (
		<>
			<div className='p-4 flex gap-2'>
				<h1 className='text-xl font-semibold'>{proposal?.name}</h1>
				<AlertDialog>
					<AlertDialogTrigger>
						<GearIcon className='w-4 h-4' />
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your account and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<form action={handleProposal} id='proposal-detail' className='w-full grid items-center gap-4'>
							<div className='grid w-full items-center gap-1.5'>
								<Label htmlFor='labor_rate'>Name</Label>
								<Input name='name' defaultValue={proposal.name} />
							</div>

							<div className='grid w-full items-center gap-1.5'>
								<Label htmlFor='labor_rate'>Labor Rate</Label>
								<Input type='number' name='labor_rate' defaultValue={proposal.labor_rate} placeholder='$0.00' />
							</div>
						</form>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction asChild>
								<Button type='submit' form='proposal-detail'>
									Confirm
								</Button>
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<Badge className='ml-auto'>Status</Badge>
			</div>

			<Separator />

			<div className='grid grid-cols-5 gap-4 p-4 items-start'>{children}</div>
		</>
	);
};

export default ProposalIdLayout;
