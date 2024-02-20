import React from 'react';
import ProposalHeader from '@/components/ProposalHeader';
import ProposalTabs from '@/components/ProposalTabs';

type Props = {
	params: { id: string };
	children: React.ReactNode;
};

const ProposalIdLayout = async ({ params, children }: Props) => {
	const { id } = params;

	if (!id) return <div></div>;

	return (
		<div className='h-screen flex flex-col items-start w-full border-b overflow-hidden'>
			<ProposalHeader id={id} />
			<ProposalTabs id={id} />
			<div className='w-full h-full overflow-hidden'>{children}</div>
		</div>
	);
};

export default ProposalIdLayout;
