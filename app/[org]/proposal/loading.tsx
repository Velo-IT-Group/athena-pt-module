import CardSkeleton from '@/components/CardSkeleton';
import React from 'react';

const ProposalLoadingPage = async () => {
	return (
		<div className='h-full flex-1'>
			<div className='container py-10'>
				<h1 className='text-3xl font-medium tracking-tight'>Overview</h1>
			</div>
			<div className='border-t container py-10 space-y-2'>
				<h3 className='text-2xl font-semibold tracking-tight'>Financial</h3>
				<CardSkeleton />
			</div>

			<div className='border-t container py-10 space-y-2'>
				<h3 className='text-2xl font-semibold tracking-tight'>Customer Information</h3>
				<CardSkeleton />
			</div>

			<div className='border-t container py-10 space-y-2'>
				<h3 className='text-2xl font-semibold tracking-tight'>Ticket Information</h3>
				<CardSkeleton />
			</div>
		</div>
	);
};

export default ProposalLoadingPage;
