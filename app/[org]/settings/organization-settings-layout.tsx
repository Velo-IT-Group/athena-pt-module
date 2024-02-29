import { Tab } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const OrganizationSettingsLayout = ({ org, children }: { org: string; children: React.ReactNode }) => {
	const tabs: Tab[] = [
		{ name: 'General', href: `/${org}/settings` },
		{ name: 'Members', href: `/${org}/settings/members` },
	];

	return (
		<>
			<div className='bg-background py-10 border-b'>
				<h1 className='text-3xl font-medium container'>Settings</h1>
			</div>
			<div className='flex items-start gap-4 py-10 container relative'>
				<div className='grid gap-1 sticky top-14'>
					{tabs.map((tab) => (
						<Button key={tab.href} variant='ghost' size='sm' className='justify-start min-w-36' asChild>
							<Link href={tab.href}>{tab.name}</Link>
						</Button>
					))}
				</div>

				<div className='space-y-4 w-full overflow-y-auto'>{children}</div>
			</div>
		</>
	);
};

export default OrganizationSettingsLayout;
