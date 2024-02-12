import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';
import { relativeDate } from '@/utils/date';
import { getTemplates } from '@/lib/data';

// @ts-ignore
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDate() {
	const year = getRandomInt(2000, 2024); // Adjust the range as needed
	const month = getRandomInt(1, 12);
	const day = getRandomInt(1, 28); // Assuming all months have up to 28 days for simplicity

	return new Date(year, month - 1, day);
}

const tickets = [
	{
		id: 1,
		summary: 'This is a test',
		created_at: generateRandomDate(),
	},
	{
		id: 2,
		summary: 'This is a test',
		created_at: generateRandomDate(),
	},
	{
		id: 3,
		summary: 'This is a test',
		created_at: generateRandomDate(),
	},
	{
		id: 4,
		summary: 'This is a test',
		created_at: generateRandomDate(),
	},
];

const NewProposalPage = async () => {
	const templates = await getTemplates();

	if (!templates) return <div></div>;

	return (
		<div className='max-w-6xl mx-auto py-16 px-4 grid gap-16'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Let&#39;s build something new</h1>
				<p className='text-muted-foreground'>To build a new Proposal, import the ticket that&#39;s associated with proposal.</p>
			</div>
			<form className='grid grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-2xl tracking-tight'>Select Associated Ticket</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='relative'>
								<MagnifyingGlassIcon className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									type='search'
									placeholder='Search'
									className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8'
								/>
							</div>
							<ScrollArea className='max-h-72 border rounded-xl'>
								{tickets.map((ticket) => (
									<div className='flex items-center gap-4 px-4 border-b p-4' key={ticket.id}>
										<Avatar className='w-6 h-6 border'>
											<AvatarImage src='https://api-frameworks.vercel.sh/framework-logos/other.svg' />
											<AvatarFallback>ST</AvatarFallback>
										</Avatar>
										<p>
											{ticket.summary} • <span className='text-sm text-muted-foreground'>{relativeDate(ticket.created_at)}</span>
										</p>
										<Button className='ml-auto'>Select</Button>
									</div>
								))}
							</ScrollArea>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='text-2xl tracking-tight'>Templates</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='relative'>
								<MagnifyingGlassIcon className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									type='search'
									placeholder='Search'
									className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8'
								/>
							</div>
							<ScrollArea className='h-72 border rounded-xl'>
								{templates.map((template) => (
									<div className='flex items-center gap-4 px-4 border-b p-4 last:border-b-0' key={template.id}>
										<p>{template.name}</p>
										<Button className='ml-auto'>Select</Button>
									</div>
								))}
							</ScrollArea>
						</div>
					</CardContent>
				</Card>

				<div className='col-span-2 flex justify-end'>
					<Button type='submit'>Submit</Button>
				</div>
			</form>
		</div>
	);
};

export default NewProposalPage;
