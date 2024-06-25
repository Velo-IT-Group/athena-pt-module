import React from 'react';
import AuthForm from '@/components/forms/AuthForm';
import Link from 'next/link';
import VeloLogo from '@/components/icons/VeloLogo';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const Page = async ({
	searchParams,
}: {
	searchParams?: {
		query?: string;
		page?: string;
		message?: string;
	};
}) => {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'azure',
		options: {
			scopes: 'email profile',
			redirectTo: `${process.env.NEXT_PUBLIC_LOCAL_URL}/auth/callback`,
		},
	});

	console.log(data, error);

	if (data.url) {
		return redirect(data.url); // use the redirect API for your server framework
	}

	return (
		<div></div>
		// <div className='container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
		// 	<div className='relative hidden h-full flex-1 flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
		// 		<div className='absolute inset-0 bg-zinc-900' />
		// 		<div className='relative z-20 flex items-center text-lg font-medium'>
		// 			<VeloLogo classname='mr-2 h-6 w-6 ' />
		// 			Velo
		// 		</div>
		// 		<div className='relative z-20 mt-auto'>
		// 			<blockquote className='space-y-2'>
		// 				<p className='text-lg'>
		// 					&ldquo;We&apos;ve been with Velo IT Group for several years now, and these guys are the real thing. They
		// 					are highly responsive, committed to excellence, and they&apos;ve helped us to modernize our IT
		// 					infrastructure across multiple states. Velo delivered on all of their promises, and we couldn&apos;t be
		// 					happier to work with them.&rdquo;
		// 				</p>
		// 				<footer className='text-sm'>Todd Trahan - President, Cal-Chlor</footer>
		// 			</blockquote>
		// 		</div>
		// 	</div>
		// 	<div className='lg:p-8'>
		// 		<div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
		// 			<div className='flex flex-col space-y-2 text-center'>
		// 				<h1 className='text-2xl font-semibold tracking-tight'>Create an account</h1>
		// 				<p className='text-sm text-muted-foreground'>Enter your email below to create your account</p>
		// 			</div>
		// 			<AuthForm />
		// 			<p className='px-8 text-center text-sm text-muted-foreground'>
		// 				By clicking continue, you agree to our{' '}
		// 				<Link
		// 					href='/terms'
		// 					className='underline underline-offset-4 hover:text-primary'
		// 				>
		// 					Terms of Service
		// 				</Link>{' '}
		// 				and{' '}
		// 				<Link
		// 					href='/privacy'
		// 					className='underline underline-offset-4 hover:text-primary'
		// 				>
		// 					Privacy Policy
		// 				</Link>
		// 				.
		// 			</p>
		// 		</div>
		// 	</div>
		// </div>
	);
};

export default Page;
