import React from 'react';
import Navbar, { Tab } from '@/components/Navbar';
import { getProposal } from '@/lib/functions/read';

type Props = {
	params: { org: string; id: string };
	children: React.ReactNode;
};

const ProposalIdLayout = async ({ params, children }: Props) => {
	const { id, org } = params;
	const proposal = await getProposal(id);

	if (!id) return <div></div>;

	const tabs: Tab[] = [
		{ name: 'Overview', href: `/${org}/proposal/${id}` },
		{ name: 'Workplan', href: `/${org}/proposal/${id}/workplan` },
		{ name: 'Products', href: `/${org}/proposal/${id}/products` },
		{ name: 'Settings', href: `/${org}/proposal/${id}/settings` },
	];

	return (
		<>
			<Navbar org={org} title={proposal?.name} tabs={tabs} />
			<div className='min-h-header bg-muted/75'>{children}</div>
		</>
	);
};

export default ProposalIdLayout;
