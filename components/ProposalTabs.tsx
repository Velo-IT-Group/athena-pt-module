'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const ProposalTabs = ({ id }: { id: string }) => {
	const pathname = usePathname();
	return (
		<div className='flex items-center gap-4 w-full px-4 border-b bg-gray-100/40 dark:bg-gray-800/40'>
			<Link
				href={`/proposal/${id}`}
				className={cn('py-2', pathname === `/proposal/${id}` ? 'border-b-2 border-primary' : 'border-b-2 border-none text-muted-foreground')}
			>
				Overview
			</Link>
			<Link
				href={`/proposal/${id}/workplan`}
				className={cn('py-2', pathname === `/proposal/${id}/workplan` ? 'border-b-2 border-primary' : 'border-b-2 border-none text-muted-foreground')}
			>
				Workplan
			</Link>
			<Link
				href={`/proposal/${id}/products`}
				className={cn(
					'py-2',
					pathname === `/proposal/${id}/products`
						? 'border-b-2 border-primary text-accent-foreground'
						: 'border-b-2 border-none text-muted-foreground'
				)}
			>
				Products
			</Link>
		</div>
	);
};

export default ProposalTabs;
