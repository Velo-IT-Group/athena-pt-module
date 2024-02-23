import Navbar from '@/components/Navbar';
import React from 'react';

const NewProposalLayout = ({ children, params }: { children: React.ReactNode; params: { org: string } }) => {
	return (
		<>
			<Navbar title='New Proposal' org={params.org} />
			<section className='bg-muted/50 flex-1'>
				<div className='container py-12'>{children}</div>
			</section>
		</>
	);
};

export default NewProposalLayout;
