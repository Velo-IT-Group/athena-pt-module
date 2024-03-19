import { Button } from '@/components/ui/button';
import React from 'react';

const ProposalLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='grow px-6 py-4 w-full space-y-4 flex flex-col'>
			<div className='flex gap-4 items-center'>
				<h1 className='text-2xl font-medium leading-none'>Settings</h1>
				{/* <p className='text-muted-foreground text-xs'>1 of 1 packages</p> */}
			</div>
			<div className='space-y-4 w-full overflow-y-auto'>{children}</div>
		</div>
	);
};

export default ProposalLayout;
