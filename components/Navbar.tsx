import Link from 'next/link';
import React from 'react';
import VeloLogo from './icons/VeloLogo';
import { SlashIcon } from '@radix-ui/react-icons';
import { getOrganization } from '@/lib/data';
import NavigationTabs from './NavigationTabs';

export type Tab = {
	name: string;
	href: string;
};

type Props = {
	title?: string;
	children?: React.ReactNode;
	org: string;
	tabs?: Tab[];
};

const Navbar = async ({ title, children, org, tabs }: Props) => {
	const organization = await getOrganization(org);

	return (
		<>
			<nav className='flex items-center gap-4 w-full px-8 h-16 relative'>
				{org ? (
					<>
						<Link href={`/${org}`}>
							<VeloLogo classname='w-6 h-6' />
						</Link>
						<SlashIcon className='h-4 opacity-15' />
					</>
				) : (
					<VeloLogo classname='w-6 h-6' />
				)}

				<span className='font-semibold'>{organization?.name ?? ''}</span>
				{title && (
					<>
						<SlashIcon className='h-4 opacity-15' />
						<span className='font-semibold'>{title}</span>
					</>
				)}
				{children}
			</nav>
			{tabs && <NavigationTabs tabs={tabs} />}
		</>
	);
};

export default Navbar;
