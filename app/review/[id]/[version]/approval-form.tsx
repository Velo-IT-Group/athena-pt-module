'use client';
import React from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServiceTicket } from '@/types/manage';
import { updateProposal } from '@/lib/functions/update';
import { convertToManageProject } from '@/app/[org]/proposal/[id]/[version]/(proposal_id)/actions';
import SubmitButton from '@/components/SubmitButton';

type Props = {
	proposal: NestedProposal;
	ticket: ServiceTicket;
};

const ApprovalForm = ({ proposal, ticket }: Props) => {
	return (
		<form
			action={async () => {
				await updateProposal(proposal.id, { status: 'signed' });
				await convertToManageProject(proposal, ticket);
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your data from our servers.
					</DialogDescription>
				</DialogHeader>
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
				<DialogFooter>
					<SubmitButton>Sign</SubmitButton>
				</DialogFooter>
			</DialogContent>
		</form>
	);
};

export default ApprovalForm;
