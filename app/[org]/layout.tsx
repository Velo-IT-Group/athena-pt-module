import React from 'react';

const OrgLayout = ({ children, params }: { children: React.ReactNode; params: { org: string } }) => {
	console.log(params.org);
	return (
		<div className='h-screen overflow-hidden'>
			<main className='h-full'>{children}</main>
		</div>
	);
};

export default OrgLayout;
