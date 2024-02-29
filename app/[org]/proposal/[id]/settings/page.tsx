import OverridableInput from '@/components/OverridableInput';
import SubmitButton from '@/components/SubmitButton';
import TicketSelector from '@/components/TicketSelector';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { deleteProposal } from '@/lib/functions/delete';
import { getOrganization, getProposal, getTicket, getTickets } from '@/lib/functions/read';
import { updateProposal } from '@/lib/functions/update';
import { getCurrencyString, parseAmount } from '@/utils/money';
import { redirect } from 'next/navigation';
import React from 'react';

const ProposalSettingsPage = async ({ params }: { params: { id: string } }) => {
	const proposal = await getProposal(params.id);
	const organization = await getOrganization();
	const tickets = await getTickets();

	const ticket = await getTicket(proposal?.service_ticket ?? 0);

	if (!proposal || !ticket) return <div></div>;

	return (
		<>
			<Card>
				<form
					action={async (data: FormData) => {
						'use server';
						await updateProposal(proposal.id, { name: data.get('name') as string });
					}}
				>
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
				<form
					action={async (data: FormData) => {
						'use server';
						const sales_hours = data.get('sales_hours') as unknown as number;
						const management_hours = data.get('management_hours') as unknown as number;
						const labor_hours = data.get('labor_hours') as unknown as number;
						console.log(data.get('labor_rate') as string);
						const labor_rate = parseAmount(data.get('labor_rate') as string);
						console.log(sales_hours, management_hours, labor_hours, labor_rate);

						await updateProposal(params.id, {
							sales_hours: sales_hours ?? proposal.sales_hours,
							management_hours: management_hours ?? proposal.management_hours,
							labor_rate: labor_rate ?? proposal.labor_rate,
							labor_hours: labor_hours ?? proposal.labor_hours,
						});
					}}
				>
					<CardHeader>
						<CardTitle>Cost Settings</CardTitle>
						<CardDescription>The ticket that the proposal was made for.</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<OverridableInput
							title='Labor Rate'
							name='labor_rate'
							defaultValue={getCurrencyString(proposal.labor_rate)}
							overriden={organization?.labor_rate !== proposal.labor_rate}
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
					<CardContent className='grid grid-cols-2 gap-4'>
						<div className='grid grid-cols-5 items-center gap-2 col-span-2'>
							<h3 className='text-sm text-muted-foreground'>Ticket</h3>
							<div className='col-span-4'>
								<TicketSelector tickets={tickets ?? []} ticket={proposal.service_ticket} />
							</div>
						</div>
						<div className='grid gap-2'>
							<h3 className='text-sm text-muted-foreground'>Summary</h3>
							<p className='font-medium'>{ticket?.summary}</p>
						</div>
						<div className='grid gap-2'>
							<h3 className='text-sm text-muted-foreground'>Summary</h3>
							<p className='font-medium'>{ticket?.summary}</p>
						</div>
						<div className='grid gap-2'>
							<h3 className='text-sm text-muted-foreground'>Company</h3>
							<p className='font-medium'>{ticket.company?.name ?? ''}</p>
						</div>
						<div className='grid gap-2'>
							<h3 className='text-sm text-muted-foreground'>Contact</h3>
							<p className='font-medium'>{ticket.contact?.name ?? ''}</p>
						</div>
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
					{/* <CardContent></CardContent> */}
					<CardFooter className='bg-red-100'>
						<SubmitButton
							formAction={async () => {
								'use server';
								await deleteProposal(proposal.id);
								redirect(`/${organization?.slug}`);
							}}
							variant='destructive'
							className='ml-auto mt-3 -mb-3'
						>
							Delete
						</SubmitButton>
					</CardFooter>
				</form>
			</Card>
		</>
	);
};

export default ProposalSettingsPage;
