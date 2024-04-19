'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SubmitButton from '@/components/SubmitButton';
import { signIn } from '@/lib/functions/read';
import { signUp } from '@/lib/functions/create';
import { toast } from 'sonner';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader } from '../ui/alert-dialog';
import { createClient } from '@/utils/supabase/client';

export default function AuthForm({ searchParams }: { searchParams?: { message: string } }) {
	const [showAlertDialog, setShowAlertDialog] = useState(true);
	const supabase = createClient();
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
						await signUp(data);

						setShowAlertDialog(true);
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
					<AlertDialogHeader>Please select</AlertDialogHeader>
					<AlertDialogAction>Save</AlertDialogAction>
				</AlertDialogContent>
			</AlertDialog>

			{searchParams?.message && <p className='mt-4 p-4 text-red-600 focus:text-red-600 focus:bg-red-50 text-center'>{searchParams.message}</p>}
		</form>
	);
}
