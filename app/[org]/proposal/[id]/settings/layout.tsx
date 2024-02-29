import { Button } from '@/components/ui/button';
import React from 'react';

const ProposalLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<div className='bg-background py-10 border-b'>
				<h1 className='text-3xl font-medium container'>Project Settings</h1>
			</div>
			<div className='flex items-start gap-4 py-10 container relative'>
				<div className='grid gap-1 sticky top-14'>
					<Button variant='ghost' size='sm' className='justify-start'>
						General
					</Button>
					<Button variant='ghost' size='sm' className='justify-start'>
						Domains
					</Button>
					<Button variant='ghost' size='sm' className='justify-start'>
						Environment Variables
					</Button>
					<Button variant='ghost' size='sm' className='justify-start'>
						Git
					</Button>
					<Button variant='ghost' size='sm' className='justify-start'>
						Integrations
					</Button>
				</div>

				<div className='space-y-4 w-full overflow-y-auto'>{children}</div>
			</div>
		</>
	);
};

export default ProposalLayout;
