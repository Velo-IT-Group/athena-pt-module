import { getIntegrations, getOrganization } from '@/lib/functions/read';
import React from 'react';
import OrganizationLayout from '../organization-layout';
import IntegrationCard from '@/components/IntegrationCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const IntegrationsPage = async ({ params }: { params: { org: string } }) => {
	const organization = await getOrganization();
	const integrationsData = await getIntegrations();

	const sectionedIntegrations = integrationsData.reduce((r, a) => {
		if (a.type === null) {
		}
		r[a.type] = r[a.type] || [];
		r[a.type].push(a);
		return r;
	}, Object.create(null));

	console.log(sectionedIntegrations);

	return (
		<OrganizationLayout org={params.org}>
			<div className='bg-background py-10 border-b'>
				<h1 className='text-3xl font-medium container'>Settings</h1>
			</div>
			<div className='flex items-start gap-4 py-10 container relative'>
				<div className='grid gap-1 sticky top-14'>
					<Button variant='ghost' size='sm' className='justify-start min-w-36' asChild>
						<Link href=''></Link>
					</Button>
					{/* {tabs.map((tab) => (
						<Button key={tab.href} variant='ghost' size='sm' className='justify-start min-w-36' asChild>
							<Link href={tab.href}>{tab.name}</Link>
						</Button>
					))} */}
				</div>

				<div className='space-y-4 w-full overflow-y-auto'>
					{/* {Object.entries(sectionedIntegrations).map([key, value]) => (
						<section key={name} className='space-y-4'>
							<h2 className='text-lg font-medium'>Resellers</h2>
							<div className='grid grid-cols-3 gap-4'>
								{integrations?.map((integration) => (
									<IntegrationCard
										key={integration.id}
										integrations={organization?.organization_integrations ?? []}
										integration={integration}
										organization={params.org}
									/>
								))}
							</div>
						</section>
					))} */}
					{Object.entries(sectionedIntegrations).map(([key, integrations]) => (
						<section key={key} className='space-y-4'>
							<h2 className='text-lg font-medium capitalize'>{key}</h2>
							<div className='grid grid-cols-3 gap-4'>
								{/* @ts-ignore */}
								{integrations?.map((integration: Integration) => (
									<IntegrationCard
										key={integration.id}
										integrations={organization?.organization_integrations ?? []}
										integration={integration}
										organization={params.org}
									/>
								))}
							</div>
						</section>
					))}
				</div>
			</div>
		</OrganizationLayout>
	);
};

export default IntegrationsPage;
