'use client';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent } from '@radix-ui/react-dialog';
import React from 'react';

type Props = {
	id: string;
};

const ApprovalForm = ({ id }: Props) => {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Are you absolutely sure?</DialogTitle>
				<DialogDescription>
					This action cannot be undone. This will permanently delete your account and remove your data from our servers.
				</DialogDescription>
			</DialogHeader>
			<form>
				<div className='grid w-full items-center gap-4'>
					<div className='flex flex-col space-y-1.5'>
						<Label htmlFor='name'>Initals</Label>
						<Input id='name' placeholder='Name of your project' />
					</div>
					<div className='flex flex-col space-y-1.5'>
						<Label htmlFor='name'>Name</Label>
						<Input id='name' placeholder='Name of your project' />
					</div>
				</div>
			</form>
			<DialogFooter>
				<Button type='submit'>Sign</Button>
			</DialogFooter>
		</DialogContent>
	);
};

export default ApprovalForm;
