import React from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from '@/components/ui/card';
import NewProposalForm from '@/components/NewProposalForm';
import { getTemplates } from '@/lib/data';

const NewPage = async () => {
	const templates = await getTemplates();

	if (!templates) return <div></div>;

	return (
		<Card className='mx-auto max-w-3xl'>
			<CardHeader>
				<CardTitle className='text-2xl'>New Proposal</CardTitle>
				<CardDescription>Create a new proposal by adding a name, selecting a template, and adding products</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<NewProposalForm templates={templates} />
			</CardContent>
		</Card>
	);
};

export default NewPage;
