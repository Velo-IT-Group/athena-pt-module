'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const ProposalTabs = ({ id }: { id: string }) => {
	const pathname = usePathname();

	const paths = [`/proposal/${id}`, `/proposal/${id}/workplan`, `/proposal/${id}/products`, `/proposal/${id}/settings`];

	return (
		<div className='flex items-center gap-4 w-full px-4 border-b bg-gray-100/40 dark:bg-gray-800/40'>
			{paths.map((path, index) => (
				<Link
					href={path}
					className={cn('py-2', pathname === path ? 'border-b-2 border-primary' : 'border-b-2 border-none text-muted-foreground')}
					key={index}
				>
					Overview
				</Link>
			))}
		</div>
	);
};

export default ProposalTabs;
