import Navbar from '@/components/Navbar';
import { getOrganization } from '@/lib/data';
import React from 'react';

const IntegrationsPage = async ({ params }: { params: { org: string } }) => {
	const organization = await getOrganization(params.org);
	const tabs = [];

	return (
		<div className='h-full flex-1'>
			<Navbar title={organization?.name ?? ''} org={params.org} tabs={[]} />
			<div className='h-full bg-muted/50 flex-1'>
				<section className='container py-10'>
					<h1 className='text-3xl font-medium tracking-tight'>Integrations</h1>
				</section>
				<section className='border-t'></section>
			</div>
		</div>
	);
};

export default IntegrationsPage;
