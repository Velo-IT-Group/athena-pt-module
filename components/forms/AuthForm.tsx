import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/SubmitButton';
import { signIn } from '@/lib/functions/read';
import { signUp } from '@/lib/functions/create';

export default function AuthForm({ searchParams }: { searchParams?: { message: string } }) {
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
