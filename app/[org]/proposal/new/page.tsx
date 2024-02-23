import React from 'react';
import { CardTitle, CardHeader, CardContent, Card, CardFooter } from '@/components/ui/card';
import NewProposalForm from '@/components/forms/NewProposalForm';
import { getTemplates, getTickets } from '@/lib/functions/read';
import SubmitButton from '@/components/SubmitButton';
import { handleProposalInsert } from '@/app/actions';

const NewProposalPage = async () => {
	const templates = await getTemplates();
	// console.log(templates);
	const tickets = await getTickets();
	// console.log('TICKETS RESPONSE', tickets);

	return (
		<Card>
			<form action={handleProposalInsert}>
				<CardHeader>
					<CardTitle>New Proposal</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<NewProposalForm templates={templates ?? []} tickets={tickets ?? []} />
				</CardContent>
				<CardFooter>
					<SubmitButton tabIndex={4}>Submit</SubmitButton>
				</CardFooter>
			</form>
		</Card>
	);
};

export default NewProposalPage;
