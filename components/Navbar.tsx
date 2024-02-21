import Link from 'next/link';
import React from 'react';
import VeloLogo from './VeloLogo';
import { SlashIcon } from '@radix-ui/react-icons';

type Props = {
	title: string;
	children?: React.ReactNode;
};

const Navbar = ({ title, children }: Props) => {
	return (
		<header className='flex items-center gap-4 w-full px-4 h-14'>
			<Link href='/proposal'>
				<VeloLogo classname='w-6 h-6' />
			</Link>

			<SlashIcon className='h-4 opacity-15' />

			<nav className='flex items-center gap-4 w-full h-14'>
				<span className='font-semibold text-lg'>{title}</span>
				{children}
			</nav>
		</header>
	);
};

export default Navbar;
