import Navbar from '@/components/Navbar';
import React from 'react';

const NewProposalLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Navbar title='New Proposal' />
			<section className='bg-muted/50 flex-1'>
				<div className='container py-12'>{children}</div>
			</section>
		</>
	);
};

export default NewProposalLayout;
