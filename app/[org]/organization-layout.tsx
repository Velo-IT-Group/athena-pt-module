import React from 'react';
import Navbar, { Tab } from '../../components/Navbar';
import { Badge } from '@/components/ui/badge';

const OrganizationLayout = ({ org, children }: { org: string; children: React.ReactNode }) => {
	const orgDashboardTabs: Tab[] = [
		{
			name: 'Overview',
			href: `/${org}`,
		},
		// {
		// 	name: 'Integrations',
		// 	href: `/${org}/integrations`,
		// },
		{
			name: 'Activity',
			href: `/${org}/activities`,
		},
		{
			name: 'Settings',
			href: `/${org}/settings`,
		},
	];

	return (
		<>
			<Navbar org={org} tabs={orgDashboardTabs} />
			<div className='min-h-header light:bg-muted/50'>{children}</div>
		</>
	);
};

export default OrganizationLayout;
