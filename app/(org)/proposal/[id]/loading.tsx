import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ProposalIdLoading = () => {
	return (
		<>
			<div className='col-span-4 space-y-4'>
				<Skeleton className='h-[125px] w-full rounded-xl' />
				<Skeleton className='h-[125px] w-full rounded-xl' />
				<Skeleton className='h-[125px] w-full rounded-xl' />
				<Skeleton className='h-[125px] w-full rounded-xl' />
				<Skeleton className='h-[125px] w-full rounded-xl' />
			</div>

			<div className='space-y-4'>
				<Skeleton className='h-[125px] w-full rounded-xl' />
				<Card>
					<CardHeader>
						<CardTitle>Totals</CardTitle>
						<CardDescription>Deploy your new project in one-click.</CardDescription>
					</CardHeader>
					<CardContent>
						<Skeleton className='h-[500px] w-full rounded-xl' />
					</CardContent>
				</Card>
			</div>
		</>

		// <div className='flex flex-col space-y-3'>
		// 	<Skeleton className='h-[125px] w-[250px] rounded-xl' />
		// 	<div className='space-y-2'>
		// 		<Skeleton className='h-4 w-[250px]' />
		// 		<Skeleton className='h-4 w-[200px]' />
		// 	</div>
		// </div>
	);
};

export default ProposalIdLoading;
