import CardSkeleton from '@/components/CardSkeleton';
import Navbar from '@/components/Navbar';
import React from 'react';

const OrganizationLoadingPage = () => {
	let blankArray = new Array(9).fill(null);

	return (
		<>
			<Navbar org='' tabs={[]} />
			<div className='min-h-header bg-muted/50'>
				<div className='container py-8 space-y-8'>
					<div className='grid grid-cols-3 gap-4'>
						{blankArray.map((_, index) => (
							<CardSkeleton key={index} />
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default OrganizationLoadingPage;
