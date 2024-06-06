import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
	className?: string;
};

const DuplicateIcon = ({ className }: Props) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={15}
			height={15}
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth={1.5}
			strokeLinecap='round'
			strokeLinejoin='round'
			className={cn('lucide lucide-copy', className)}
		>
			<rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
			<path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
		</svg>
	);
};

export default DuplicateIcon;
