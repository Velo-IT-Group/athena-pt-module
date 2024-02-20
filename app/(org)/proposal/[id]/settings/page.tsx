import { handleProposalUpdate } from '@/app/actions';
import OverridableInput from '@/components/OverridableInput';
import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getProposal, getTicket, updateProposal } from '@/lib/data';
import { getCurrencyString } from '@/utils/money';
import { revalidateTag } from 'next/cache';
import React from 'react';

const ProposalSettingsPage = async ({ params }: { params: { id: string } }) => {
	const proposal = await getProposal(params.id);

	// const ticket = await getTicket(proposal?.service_ticket ?? 0);

	const updateName = async (data: FormData) => {
		'use server';
		const name = data.get('name') as string;
		await updateProposal(params.id, { name });

		revalidateTag('proposals');
	};

	const updateCostSettings = async (data: FormData) => {
		'use server';
		const sales_hours = data.get('sales_hours') as unknown as number;
		const management_hours = data.get('management_hours') as unknown as number;
		const labor_hours = data.get('labor_hours') as unknown as number;
		const labor_rate = data.get('labor_rate') as unknown as number;
		console.log(sales_hours, management_hours, labor_rate, labor_hours);
		await updateProposal(params.id, { sales_hours, management_hours, labor_rate, labor_hours });

		revalidateTag('proposals');
	};

	if (!proposal) return <div></div>;

	return (
		<div className='bg-muted flex-1'>
			<div className='flex items-start gap-4 container'>
				<div className='py-4 grid gap-1'>
					<Button variant='ghost' size='sm' className='justify-start'>
						General
					</Button>
					<Button variant='ghost' size='sm' className='justify-start'>
						Domains
					</Button>
					<Button variant='ghost' size='sm' className='justify-start'>
						Environment Variables
					</Button>
					<Button variant='ghost' size='sm' className='justify-start'>
						Git
					</Button>
					<Button variant='ghost' size='sm' className='justify-start'>
						Integrations
					</Button>
				</div>

				<div className='p-4 space-y-4 w-full overflow-y-auto'>
					<Card>
						<form action={updateName}>
							<CardHeader>
								<CardTitle>Proposal Name</CardTitle>
								<CardDescription>Used to identify your Project on the Dashboard, Vercel CLI, and in the URL of your Deployments.</CardDescription>
							</CardHeader>
							<CardContent>
								<Input required name='name' defaultValue={proposal.name} />
							</CardContent>
							<CardFooter>
								<SubmitButton className='ml-auto'>Save</SubmitButton>
							</CardFooter>
						</form>
					</Card>

					<Card>
						<form action={updateCostSettings}>
							<CardHeader>
								<CardTitle>Cost Settings</CardTitle>
								<CardDescription>The ticket that the proposal was made for.</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<OverridableInput
									title='Labor Rate'
									name='labor_rate'
									defaultValue={getCurrencyString(proposal.labor_rate)}
									overriden={false}
									type='text'
								/>
								<OverridableInput
									title='Management Hours'
									name='management_hours'
									defaultValue={proposal.management_hours}
									overriden={false}
									type='number'
								/>
								<OverridableInput title='Labor Hours' name='labor_hours' defaultValue={proposal.labor_hours} overriden={false} type='number' />
								<OverridableInput title='Sales Hours' name='sales_hours' defaultValue={proposal.sales_hours} overriden={false} type='number' />
								<OverridableInput
									title='Labor Price'
									name='total_labor_price'
									defaultValue={getCurrencyString(proposal.total_labor_price)}
									overriden={false}
									type='text'
								/>
								<OverridableInput
									title='Hours Required'
									name='hours_required'
									defaultValue={proposal.hours_required ?? undefined}
									overriden={false}
									type='number'
								/>
							</CardContent>
							<CardFooter>
								<SubmitButton className='ml-auto'>Save</SubmitButton>
							</CardFooter>
						</form>
					</Card>

					<Card>
						<form>
							<CardHeader>
								<CardTitle>Service Ticket</CardTitle>
								<CardDescription>The ticket that the proposal was made for.</CardDescription>
							</CardHeader>
							<CardContent>
								{/* <div className='grid gap-2'>
							<h3 className='font-medium'>Summary</h3>
							<p>{ticket?.summary}</p>
						</div>
						<div className='grid gap-2'>
							<h3 className='font-medium'>Company</h3>
							<p>{ticket?.company.name}</p>
						</div>
						<div className='grid gap-2'>
							<h3 className='font-medium'>Contact</h3>
							<p>{ticket?.contact.name}</p>
						</div> */}
							</CardContent>
							<CardFooter>
								<SubmitButton className='ml-auto' disabled={true}>
									Save
								</SubmitButton>
							</CardFooter>
						</form>
					</Card>

					<Card>
						<form>
							<CardHeader>
								<CardTitle>Delete Proposal</CardTitle>
								<CardDescription>
									The proposal will be permanently deleted, including its deployments and domains. This action is irreversible and can not be undone.
								</CardDescription>
							</CardHeader>
							<CardContent></CardContent>
							<CardFooter className='bg-red-50'>
								<SubmitButton className='ml-auto' disabled={true}>
									Save
								</SubmitButton>
							</CardFooter>
						</form>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ProposalSettingsPage;
