import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import createSupabaseServerClient from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default function AuthForm() {
	async function createInvoice(formData: FormData) {
		'use server';
		const supabase = await createSupabaseServerClient();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return;
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (!data || error) {
			return;
		}

		redirect('/account');
	}

	return (
		<form action={createInvoice} className='max-w-72 mx-auto space-y-2'>
			<div className='grid w-full max-w-sm items-center gap-1.5'>
				<Label htmlFor='email'>Email</Label>
				<Input type='email' id='email' placeholder='Email' />
			</div>
			<div className='grid w-full max-w-sm items-center gap-1.5'>
				<Label htmlFor='password'>Password</Label>
				<Input type='password' id='password' placeholder='•••••' />
			</div>
			<Button type='submit'>Login</Button>
			{/* <Auth
				supabaseClient={supabase}
				view='sign_in'
				appearance={{ theme: ThemeSupa }}
				theme='dark'
				showLinks={true}
				providers={['azure']}
				redirectTo='http://localhost:3000/auth/callback'
			/> */}
		</form>
	);
}
