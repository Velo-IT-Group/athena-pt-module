'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SubmitButton from '@/components/SubmitButton';
import { getMembers, signIn } from '@/lib/functions/read';
import { signUp } from '@/lib/functions/create';
import { toast } from 'sonner';
import { useState } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '../ui/alert-dialog';
import { getSystemMembers } from '@/utils/manage/read';
import { SystemMember } from '@/types/manage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function AuthForm({ searchParams }: { searchParams?: { message: string } }) {
	const [showAlertDialog, setShowAlertDialog] = useState(false);
	const [possibleMembers, setPossibleMembers] = useState<SystemMember[]>([]);
	const [credentials, setCredentials] = useState<FormData>(new FormData());

	return (
		<form className='animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground' action={signIn}>
			<Label htmlFor='email'>Email</Label>
			<Input name='email' placeholder='you@example.com' autoComplete='email' required />

			<Label htmlFor='password'>Password</Label>
			<Input type='password' name='password' placeholder='••••••••' autoComplete='current-password' required />

			<SubmitButton>Sign in</SubmitButton>

			<SubmitButton
				className='text-card-foreground'
				formAction={async (data: FormData) => {
					try {
						const members = await getSystemMembers(data.get('email') as string);

						if (members.length > 1) {
							setCredentials(data);
							setPossibleMembers(members);
							setShowAlertDialog(true);
						} else if (members.length > 0) {
							const { firstName, lastName, id } = members[0];
							await signUp(data, { first_name: firstName, last_name: lastName, manage_reference_id: id });
						}
					} catch (error) {
						toast('Could not authenticate user', { style: { color: 'red' } });
					}
				}}
				variant='outline'
			>
				Sign Up
			</SubmitButton>

			<AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Select a ConnectWise Member</AlertDialogTitle>
						<AlertDialogDescription>
							It appears multiple members have been found by that email. Please select one and click &apos;Save&apos;.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<form
						action={async (data) => {
							const member_id = parseInt(data.get('manage_reference_id') as string);
							const member = possibleMembers.find((member) => member.id === member_id);
							await signUp(credentials, { first_name: member?.firstName || '', last_name: member?.lastName || '', manage_reference_id: member_id });
						}}
					>
						<Select name='manage_reference_id'>
							<SelectTrigger>
								<SelectValue placeholder='Select a system member' />
							</SelectTrigger>
							<SelectContent>
								{possibleMembers.map((member) => (
									<SelectItem key={member.id} value={member.id.toString()}>
										{member.firstName} {member.lastName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</form>

					<AlertDialogFooter>
						<AlertDialogCancel>Close</AlertDialogCancel>
						<AlertDialogAction>Save</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{searchParams?.message && <p className='mt-4 p-4 text-red-600 focus:text-red-600 focus:bg-red-50 text-center'>{searchParams.message}</p>}
		</form>
	);
}
