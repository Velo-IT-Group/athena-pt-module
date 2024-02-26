import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CardSkeleton = () => {
	return (
		<div className='flex flex-col h-full space-y-3'>
			<Skeleton className='h-40 rounded-xl' />
			<div className='space-y-2'>
				<Skeleton className='h-4 w-[250px]' />
				<Skeleton className='h-4 w-[200px]' />
			</div>
		</div>
	);
};

export default CardSkeleton;
