'use client';
import DatePicker from '@/components/DatePicker';
import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createOpportunity, createProject, createProjectPhase } from '@/lib/functions/create';
import {
	getOpportunityStatuses,
	getOpportunityTypes,
	getProjectBoards,
	getProjectStatuses,
} from '@/lib/functions/read';
import { ServiceTicket } from '@/types/manage';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { convertToManageProject } from '../actions';

export default function ConversionModal({
	proposal,
	ticket,
	phases,
}: {
	proposal: NestedProposal;
	ticket: ServiceTicket;
	phases: NestedPhase[];
}) {
	const [selectedTab, setSelectedTab] = useState(proposal.opportunity_id ? 'project' : 'opportunity');

	const [statuses, setStatuses] = useState<{ id: number; name: string }[] | undefined>();
	const [types, setTypes] = useState<{ id: number; description: string }[] | undefined>();
	const [projectBoards, setProjectBoards] = useState<{ id: number; name: string }[] | undefined>();
	const [projectStatuses, setProjectStatuses] = useState<{ id: number; name: string }[] | undefined>();

	const [hasCopied, setHasCopied] = useState(false);
	const [projectLinkIsCopied, setProjectLinkIsCopied] = useState(false);
	const [isCompleted, setIsCompleted] = useState(proposal?.project_id !== null);

	const [estimatedStart, setEstimatedStart] = useState<Date | undefined>();
	const [estimatedEnd, setEstimatedEnd] = useState<Date | undefined>();

	const [opportunityId, setOpportunityId] = useState<number | undefined>(proposal?.opportunity_id ?? undefined);

	useEffect(() => {
		Promise.all([getOpportunityTypes(), getOpportunityStatuses(), getProjectStatuses(), getProjectBoards()]).then(
			([opportunityTypes, opportunityStatuses, projectStatusesResponse, projectBoardsResponse]) => {
				setTypes(opportunityTypes);
				setStatuses(opportunityStatuses);
				setProjectStatuses(projectStatusesResponse);
				setProjectBoards(projectBoardsResponse);
			}
		);
	}, []);

	return (
		<>
			{!isCompleted ? (
				<Tabs
					defaultValue='opportunity'
					value={selectedTab}
					onValueChange={(e) => setSelectedTab(e)}
					className=''
				>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger value='opportunity'>Opportunity</TabsTrigger>
						<TabsTrigger
							disabled={!opportunityId}
							value='project'
						>
							Project
						</TabsTrigger>
						<TabsTrigger
							// disabled
							value='workplan'
						>
							Workplan
						</TabsTrigger>
					</TabsList>

					<TabsContent value='opportunity'>
						<Card>
							<form
								action={async () => {
									try {
										const opportunity = await convertToManageProject(proposal, ticket, phases);
										toast('Opportunity created!');
										setOpportunityId(opportunity);
										setSelectedTab('project');
									} catch (error) {
										toast('Error creating opportunity...', { description: <p>{JSON.stringify(error, null, 2)}</p> });
									}
								}}
							>
								<CardHeader>
									<CardTitle>Opportunity Information</CardTitle>
									<CardDescription>Opportunity Description</CardDescription>
								</CardHeader>
								<CardContent className='space-y-2'>
									<div className='space-y-1'>
										<Label htmlFor='name'>Name</Label>
										<Input
											id='name'
											name='name'
											defaultValue={proposal.name}
										/>
									</div>

									<div className='space-y-1'>
										<Label htmlFor='name'>Status</Label>
										<Select defaultValue={String(2)}>
											<SelectTrigger>
												<SelectValue placeholder='Select a status' />
											</SelectTrigger>
											<SelectContent>
												{statuses?.map((status) => (
													<SelectItem
														key={status.id}
														value={status.id.toString()}
													>
														{status.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className='space-y-1'>
										<Label htmlFor='name'>Status</Label>
										<Select defaultValue={String(5)}>
											<SelectTrigger>
												<SelectValue placeholder='Select a type' />
											</SelectTrigger>
											<SelectContent>
												{types?.map((type) => (
													<SelectItem
														key={type.id}
														value={type.id.toString()}
													>
														{type.description}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</CardContent>
								<CardFooter>
									<SubmitButton
										disabled={opportunityId !== undefined}
										className='ml-auto'
									>
										{opportunityId !== undefined ? 'Opportunity Created' : 'Create Opportunity'}
									</SubmitButton>
								</CardFooter>
							</form>
						</Card>
					</TabsContent>

					<TabsContent value='project'>
						<Card>
							<form
								action={async (data: FormData) => {
									const name = data.get('projectName') as string;
									const status = parseInt(data.get('status') as string);
									const board = parseInt(data.get('board') as string);

									console.log(name, status, board);

									try {
										const project = await createProject(
											{
												board: { id: board },
												estimatedStart: estimatedStart!.toISOString().split('.')[0] + 'Z',
												estimatedEnd: estimatedEnd!.toISOString().split('.')[0] + 'Z',
											},
											proposal.id,
											opportunityId ? opportunityId : 0
										);

										toast('Project created!');

										if (proposal.phases) {
											await Promise.all(proposal.phases?.map((phase) => createProjectPhase(project!.id, phase)));

											toast('Phases added');
										}

										setIsCompleted(true);
									} catch (error) {
										toast('Error creating project...', { description: <p>{JSON.stringify(error, null, 2)}</p> });
									}
								}}
							>
								<CardHeader>
									<CardTitle>Project Info</CardTitle>
									<CardDescription>Project info description.</CardDescription>
								</CardHeader>

								<CardContent className='space-y-2'>
									<div className='space-y-1'>
										<Label htmlFor='projectName'>Project Name</Label>
										<Input
											required
											id='projectName'
											name='projectName'
											defaultValue={proposal.name}
										/>
									</div>

									<div className='space-y-1'>
										<Label htmlFor='status'>Project Status</Label>
										<Select
											name='status'
											defaultValue='8'
											required
										>
											<SelectTrigger>
												<SelectValue placeholder='Select a status' />
											</SelectTrigger>
											<SelectContent>
												{projectStatuses?.map((status) => (
													<SelectItem
														key={status.id}
														value={status.id.toString()}
													>
														{status.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className='space-y-1'>
										<Label htmlFor='board'>Project Board</Label>
										<Select
											name='board'
											defaultValue='25'
											required
										>
											<SelectTrigger>
												<SelectValue placeholder='Select a board' />
											</SelectTrigger>
											<SelectContent>
												{projectBoards?.map((status) => (
													<SelectItem
														key={status.id}
														value={status.id.toString()}
													>
														{status.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className='space-y-1'>
										<Label htmlFor='estimatedStart'>Estimated Start Date</Label>
										<DatePicker
											date={estimatedStart}
											setDate={setEstimatedStart}
										/>
									</div>
									<div className='space-y-1'>
										<Label htmlFor='estimatedEnd'>Estimated End Date </Label>
										<DatePicker
											date={estimatedEnd}
											setDate={setEstimatedEnd}
										/>
									</div>
								</CardContent>

								<CardFooter>
									<SubmitButton className='ml-auto'>Create Project</SubmitButton>
								</CardFooter>
							</form>
						</Card>
					</TabsContent>

					<TabsContent value='workplan'>
						<Card>
							<form
								action={async (data: FormData) => {
									const name = data.get('projectName') as string;
									const status = parseInt(data.get('status') as string);
									const board = parseInt(data.get('board') as string);

									try {
										const project = await createProject(
											{
												board: { id: board },
												estimatedStart: estimatedStart!.toISOString().split('.')[0] + 'Z',
												estimatedEnd: estimatedEnd!.toISOString().split('.')[0] + 'Z',
											},
											proposal.id,
											opportunityId ? opportunityId : 0
										);

										toast('Project created!');

										if (proposal.phases) {
											await Promise.all(proposal.phases?.map((phase) => createProjectPhase(project!.id, phase)));

											toast('Phases added');
										}

										setIsCompleted(true);
									} catch (error) {
										toast('Error creating project...', { description: <p>{JSON.stringify(error, null, 2)}</p> });
									}
								}}
							>
								<CardHeader>
									<CardTitle>Workplan</CardTitle>
									<CardDescription>Project info description.</CardDescription>
								</CardHeader>

								<CardContent className='space-y-2'>
									{phases?.map((phase) => (
										<Card key={phase.id}>
											<CardHeader>
												<CardTitle>{phase.description}</CardTitle>
											</CardHeader>
										</Card>
									))}
								</CardContent>

								<CardFooter>
									<SubmitButton className='ml-auto'>Create Project</SubmitButton>
								</CardFooter>
							</form>
						</Card>
					</TabsContent>
				</Tabs>
			) : (
				<>
					<Card>
						<CardHeader>
							<CardTitle>Successfully Transfered</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2'>
							<div className='space-y-1'>
								<Label htmlFor='opportunity_external_link'>Opportunity Link</Label>
								<div className='flex items-center space-x-2'>
									<Input
										id='opportunity_external_link'
										defaultValue={`https://manage.velomethod.com/v4_6_release/services/system_io/router/openrecord.rails?recordType=OpportunityFV&recid=${1}&companyName=velo`}
										readOnly
										className='h-9'
									/>
									<Button
										type='submit'
										size='sm'
										className='px-3'
										onClick={() => {
											navigator.clipboard.writeText(
												`https://manage.velomethod.com/v4_6_release/services/system_io/router/openrecord.rails?recordType=OpportunityFV&recid=${1}&companyName=velo`
											);
											setProjectLinkIsCopied(true);
										}}
									>
										<span className='sr-only'>Copy</span>
										{projectLinkIsCopied ? <CheckIcon className='h-4 w-4' /> : <CopyIcon className='h-4 w-4' />}
									</Button>
								</div>
							</div>

							<div className='space-y-1'>
								<Label htmlFor='project_external_link'>Project Link</Label>
								<div className='flex items-center space-x-2'>
									<Input
										id='project_external_link'
										defaultValue={`https://manage.velomethod.com/v4_6_release/services/system_io/router/openrecord.rails?recordType=ProjectHeaderFV&recid=928&companyName=velo`}
										readOnly
										className='h-9'
									/>
									<Button
										type='submit'
										size='sm'
										className='px-3'
										onClick={() => {
											navigator.clipboard.writeText(
												`https://manage.velomethod.com/v4_6_release/services/system_io/router/openrecord.rails?recordType=ProjectHeaderFV&recid=928&companyName=velo`
											);
											setHasCopied(true);
										}}
									>
										<span className='sr-only'>Copy</span>
										{hasCopied ? <CheckIcon className='h-4 w-4' /> : <CopyIcon className='h-4 w-4' />}
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								variant='secondary'
								type='button'
							>
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</>
			)}
		</>
	);
}
