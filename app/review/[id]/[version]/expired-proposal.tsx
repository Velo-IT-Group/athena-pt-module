import { ClockIcon } from '@radix-ui/react-icons';
import React from 'react';

const ExpiredProposal = () => {
	return (
		<div className='absolute p-4 z-50 grid place-items-center bg-black/25 h-screen w-screen backdrop-blur-md'>
			<div className='flex flex-col items-center gap-2 justify-center bg-card py-16 px-8 rounded-md text-center'>
				<div className='bg-yellow-100 p-1 rounded-full'>
					<ClockIcon className='w-12 h-12 text-yellow-400' />
				</div>
				<h1 className='text-2xl font-semibold'>The proposal has expired.</h1>
				<p className='text-muted-foreground'>
					This proposal has expired.
					<br />
					Please reach out to your contact for assistance.
				</p>
			</div>
		</div>
	);
};

export default ExpiredProposal;
