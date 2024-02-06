import React from 'react';
import AuthForm from '@/components/AuthForm';

const LoginPage = () => {
	return (
		<div className='row'>
			<div className='col-6'>
				<h1 className='header'>Supabase Auth + Storage</h1>
				<p>
					Experience our Auth and Storage through a simple profile management example. Create a user profile and upload an avatar image. Fast, simple,
					secure.
				</p>
			</div>
			<div className='col-6 auth-widget'>
				<AuthForm />
			</div>
		</div>
	);
};

export default LoginPage;
