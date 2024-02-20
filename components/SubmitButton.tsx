'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useFormStatus } from 'react-dom';
import { type VariantProps } from 'class-variance-authority';

type Props = {
	children: React.ReactNode;
	tabIndex?: number;
	className?: string;
	disabled?: boolean;
	variant?: VariantProps<typeof buttonVariants>;
};

// export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>

const SubmitButton = ({ children, tabIndex, className, disabled }: Props) => {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' tabIndex={tabIndex} disabled={disabled || pending} className={className}>
			<>
				{pending && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
				{children}
			</>
		</Button>
	);
};

export default SubmitButton;
