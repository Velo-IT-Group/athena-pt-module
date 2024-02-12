import NavHeader from '@/components/NavHeader';
import React from 'react';

const OrgLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='h-screen overflow-hidden'>
			{/* <NavHeader /> */}
			<main className='h-full'>{children}</main>
		</div>
	);
};

export default OrgLayout;
