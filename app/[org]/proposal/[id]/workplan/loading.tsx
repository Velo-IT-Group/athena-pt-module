import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusIcon } from '@radix-ui/react-icons';
import React from 'react';

const WorkplanLoadingPage = () => {
	const blankArray = new Array(27).fill(null);
	const workplanAray = new Array(3).fill(null);

	return (
		<main className='min-h-header bg-background'>
			<div className='grid grid-cols-[288px_1fr]'>
				<div className='border-r relative'>
					<div className='h-header relative'>
						<div className='flex flex-col flex-grow py-8 px-4 space-y-2'>
							<div className='flex items-center gap-2'>
								<h2 className='font-semibold text-base'>Project Templates</h2>
							</div>
							<div className='grid gap-2 sticky top-2'>
								<Input className='bg-background rounded-xl' id='search' placeholder='Search templates...' />
							</div>
							{blankArray.map((_, index) => (
								<Skeleton key={index} className='w-full h-9 rounded-xl' />
							))}
						</div>
					</div>
				</div>
				<div className='h-header'>
					<div className='flex flex-col flex-grow py-8 px-4 space-y-2'>
						<div className='w-full flex justify-between items-center'>
							<h1 className='text-2xl font-semibold'>Workplan</h1>
							<Button disabled>
								<PlusIcon className='w-4 h-4' />
							</Button>
						</div>
						{workplanAray.map((_, index) => (
							<Skeleton key={index} className='w-full h-16 rounded-xl' />
						))}
					</div>
				</div>
			</div>
		</main>
	);
};

export default WorkplanLoadingPage;
