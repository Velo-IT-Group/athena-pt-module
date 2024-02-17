'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';

type Props = {
	children: React.ReactNode;
	tabIndex?: number;
};

// export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>

const SubmitButton = ({ children, tabIndex }: Props) => {
	const { pending } = useFormStatus();

	return (
		<Button tabIndex={tabIndex} disabled={pending}>
			<>
				{pending && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
				{children}
			</>
		</Button>
	);
};

export default SubmitButton;
