import React from 'react';
import Navbar, { Tab } from '../../components/Navbar';
import { Separator } from '@/components/ui/separator';

const OrganizationLayout = ({ org, children }: { org: string; children: React.ReactNode }) => {
	return (
		<>
			<Navbar org={org} />
			<Separator />
			<div className='min-h-header light:bg-muted/50 flex flex-col'>{children}</div>
		</>
	);
};

export default OrganizationLayout;
