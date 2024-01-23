'use client';
import React, { useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectTemplateForm from '../project-template-form';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { projectTemplateTickets, projectWorkPlans } from '@/data';
import { ProjectWorkPlan } from '@/types';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import ProposalTotalCard from '../proposal-total-card';

const ProposalPage = () => {
	const [workPlans, setWorkPlans] = useState<Array<ProjectWorkPlan>>(projectWorkPlans);

	const addPhase = () => {
		setWorkPlans([
			...workPlans,
			{
				iD: workPlans.length + 1,
				description: 'New Phase',
			},
		]);
	};

	return (
		<div className='grid grid-cols-4 gap-6 items-start'>
			<ProjectTemplateForm />

			<div className='grid gap-6 col-span-2'>
				{workPlans.map((plan, index) => (
					<Collapsible key={index}>
						<CollapsibleTrigger className='w-full'>
							<Card className='flex'>
								<CardHeader className='flex flex-row items-center justify-between w-full'>
									<div className='flex flex-col items-start'>
										<CardTitle>Phase {plan?.iD ?? 1}</CardTitle>
										<CardDescription>{plan?.description ?? 'New Phase'}</CardDescription>
									</div>
									<div className='flex flex-col items-start'>
										<CardTitle>Hours:</CardTitle>
										<CardDescription>
											<Input value={plan?.budgetAmount ?? 0.0} />
										</CardDescription>
									</div>
								</CardHeader>
							</Card>
						</CollapsibleTrigger>
						<CollapsibleContent className='p-4'>
							<Table>
								<TableCaption>A list of your recent invoices.</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead className='w-[100px]'>Invoice</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className='text-right'>Amount</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{projectTemplateTickets.map((ticket) => (
										<TableRow key={ticket.id}>
											<TableCell className='font-medium'>Ticket {ticket.id}</TableCell>
											<TableCell>{ticket.description ?? ''}</TableCell>
											<TableCell className='text-right'>{ticket.budgetHours ?? 0.0}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CollapsibleContent>
					</Collapsible>
				))}

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger>
							<Button onClick={addPhase} variant='outline' size='icon'>
								<PlusIcon className='h-4 w-4' />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Add new phase</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<ProposalTotalCard />
		</div>
	);
};

export default ProposalPage;
