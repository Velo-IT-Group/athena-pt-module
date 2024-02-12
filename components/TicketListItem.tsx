import React from 'react';
import { Card, CardHeader, CardTitle } from './ui/card';

const TicketListItem = ({ ticket }: { ticket: Ticket }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{ticket.summary}</CardTitle>
			</CardHeader>
		</Card>
	);
};

export default TicketListItem;
