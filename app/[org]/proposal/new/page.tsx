import React from 'react';
import { CardTitle, CardHeader, CardContent, Card, CardFooter } from '@/components/ui/card';
import NewProposalForm from '@/components/forms/NewProposalForm';
import { getOrganization, getTemplates, getTickets } from '@/lib/functions/read';
import SubmitButton from '@/components/SubmitButton';
import { createProposal } from '@/lib/functions/create';

const NewProposalPage = async () => {
	const templates = await getTemplates();
	const organization = await getOrganization();
	// console.log(templates);
	const tickets = await getTickets();
	// console.log('TICKETS RESPONSE', tickets);
	if (!organization) return <div></div>;

	return (
		<Card>
			<form
				action={async (data: FormData) => {
					'use server';
					const name = data.get('name') as string;
					const templates_used = data.getAll('templates_used') as unknown as number[];
					const service_ticket = data.get('service_ticket') as unknown as number;
					// @ts-ignore
					await createProposal({ name, templates_used: [...templates_used, organization?.default_template], service_ticket });
				}}
			>
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
