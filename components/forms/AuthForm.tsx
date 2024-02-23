import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SubmitButton from '@/components/SubmitButton';

export default function AuthForm({ searchParams }: { searchParams?: { message: string } }) {
	const signIn = async (formData: FormData) => {
		'use server';

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const supabase = createClient();

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error(error);
			return redirect('/login?message=Could not authenticate user');
		}

		return redirect('/velo-it-group');
	};

	const signUp = async (formData: FormData) => {
		'use server';

		const origin = headers().get('origin');
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const supabase = createClient();

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${origin}/auth/callback`,
			},
		});

		if (error) {
			return redirect('/login?message=Could not authenticate user');
		}

		return redirect('/login?message=Check email to continue sign in process');
	};

	return (
		<form className='animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground' action={signIn}>
			<Label htmlFor='email'>Email</Label>
			<Input name='email' placeholder='you@example.com' autoComplete='email' required />

			<Label htmlFor='password'>Password</Label>
			<Input type='password' name='password' placeholder='••••••••' autoComplete='current-password' required />

			<SubmitButton>Sign in</SubmitButton>
			<Button formAction={signUp} variant='outline'>
				Sign Up
			</Button>

			{searchParams?.message && <p className='mt-4 p-4 text-red-500 text-center'>{searchParams.message}</p>}
		</form>
	);
}
