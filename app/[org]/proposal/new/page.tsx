import React from 'react';
import { CardTitle, CardHeader, CardContent, Card, CardFooter } from '@/components/ui/card';
import NewProposalForm from '@/components/NewProposalForm';
import { getTemplates, getTickets } from '@/lib/data';
import SubmitButton from '@/components/SubmitButton';
import { handleProposalInsert } from '@/app/actions';

const NewProposalPage = async () => {
	const templates = await getTemplates();
	const tickets = await getTickets();

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
