import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getTicket } from '@/utils/manage/read';

type Props = {
	ticketId: number | null;
};

const ProposalCardStatus = async ({ ticketId }: Props) => {
	if (!ticketId) return <div></div>;
	const { status } = await getTicket(ticketId, ['status']);

	return (
		<div className='flex items-center'>
			<Badge className='whitespace-nowrap'>{status?.name}</Badge>
		</div>
	);
};

export default ProposalCardStatus;
