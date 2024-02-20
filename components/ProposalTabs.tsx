'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';

const ProposalTabs = ({ id }: { id: string }) => {
	const pathname = usePathname();

	const paths = [
		{ name: 'Overview', href: `/proposal/${id}` },
		{ name: 'Workplan', href: `/proposal/${id}/workplan` },
		{ name: 'Products', href: `/proposal/${id}/products` },
		{ name: 'Settings', href: `/proposal/${id}/settings` },
	];

	return (
		<div className='sticky top-0 -mt-2 z-10 w-full border-b'>
			<div className='flex items-center px-4'>
				{paths.map((path, index) => (
					<Link
						href={path.href}
						className={cn(
							'relative py-2 transition-colors ease-in-out',
							pathname === path.href ? '' : 'border-b-2 border-none text-muted-foreground'
						)}
						key={index}
					>
						{pathname === path.href && <div className='block absolute h-0 left-2 right-2 bottom-0 border-b-2 border-primary duration-200'></div>}
						<Button variant='ghost' className='font-light'>
							{path.name}
						</Button>
					</Link>
				))}
			</div>
		</div>
	);
};

export default ProposalTabs;
