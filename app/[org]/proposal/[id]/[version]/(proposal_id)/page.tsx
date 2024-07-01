import { Separator } from '@/components/ui/separator';
import { getPhases, getProducts, getProposal } from '@/lib/functions/read';
import { relativeDate } from '@/utils/date';
import { getCurrencyString } from '@/utils/money';
import { CalendarIcon, FileTextIcon, StopwatchIcon } from '@radix-ui/react-icons';
import React from 'react';
import ProductList from './product-list';
import ExpirationDatePicker from './expiration-date-picker';
import { calculateTotals } from '@/utils/helpers';
import { getTicket } from '@/utils/manage/read';

type Props = {
	params: { id: string; version: string };
};

const ProposalPage = async ({ params }: Props) => {
	const [proposal, products, phases] = await Promise.all([
		getProposal(params.id),
		getProducts(params.version),
		getPhases(params.version),
	]);

	if (!proposal) return <div></div>;

	const ticket = await getTicket(proposal?.service_ticket ?? 0, ['contactName', 'contactEmailAddress']);

	const { totalPrice, laborHours } = calculateTotals(products, phases ?? [], proposal.labor_rate);

	return (
		<div className='grid grid-cols-12 flex-1'>
			<div className='py-16 pl-12 pr-16 w-full col-span-9 space-y-16'>
				<section className='space-y-4 w-1/2'>
					<h2 className='text-xl font-semibold'>Customer</h2>
					<div className='space-y-1'>
						<Separator />
						<div className='flex justify-between items-center w-full'>
							<div>
								<div className='font-medium text-sm'>{ticket?.contactName}</div>
								<div className='text-sm text-muted-foreground'>{ticket?.contactEmailAddress}</div>
							</div>
						</div>
						<Separator />
					</div>
				</section>

				<section className='grid sm:grid-cols-2 gap-4 sm:gap-12'>
					<div className='space-y-4'>
						<h2 className='text-xl font-semibold'>Expiration date</h2>
						<div className=''>
							<ExpirationDatePicker
								id={params.id}
								expiration_date={proposal.expiration_date ?? undefined}
							/>
						</div>
					</div>

					{/* <div className='space-y-4'>
						<h2 className='text-xl font-semibold flex items-center justify-between gap-2'>Labor Hours</h2>
						<div className='grid gap-3'>
							<div className='grid sm:grid-cols-3 items-center gap-4'>
								<Label>Sales Hours</Label>
								<BlurredInput defaultValue={proposal.sales_hours} proposalKey='sales_hours' id={proposal.id} />
							</div>

							<div className='grid sm:grid-cols-3 items-center gap-4'>
								<Label>Management Hours</Label>
								<BlurredInput defaultValue={proposal.management_hours} proposalKey='management_hours' id={proposal.id} />
							</div>
						</div>
					</div> */}
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold flex items-center justify-between gap-2'>
						Products{' '}
						<div className='font-normal text-sm flex items-center text-muted-foreground'>
							{/* <Switch className='mr-2' /> Collect tax automatically */}
						</div>
					</h2>
					<div className='space-y-1'>
						<Separator />
						<ProductList products={products} />
						<Separator />
					</div>
				</section>
			</div>

			<div className='border-l py-16 pl-12 pr-16 w-full col-span-3 space-y-16 bg-muted/50'>
				<div className='space-y-2'>
					<h2 className='text-xl font-semibold'>Summary</h2>
				</div>

				<section className='flex items-start gap-4'>
					<FileTextIcon className='text-primary w-4 h-4' />
					<div className='space-y-3'>
						<h2 className='text-xs'>TOTAL AMOUNT</h2>
						<p className='text-muted-foreground font-medium text-sm uppercase'>{getCurrencyString(totalPrice)}</p>
					</div>
				</section>

				<section className='flex items-start gap-4'>
					<StopwatchIcon className='text-primary w-4 h-4' />
					<div className='space-y-3'>
						<h2 className='text-xs'>LABOR HOURS</h2>
						<p className='text-muted-foreground font-medium text-sm'>{laborHours ?? 0} hrs</p>
					</div>
				</section>

				<section className='flex items-start gap-4'>
					<CalendarIcon className='text-primary w-4 h-4' />
					<div className='space-y-3'>
						<h2 className='text-xs'>EXPIRATION DATE</h2>
						{proposal.expiration_date ? (
							<p className='text-muted-foreground font-medium text-sm'>
								{new Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date(proposal.expiration_date))}
							</p>
						) : (
							<p className='text-muted-foreground font-medium text-sm'>No expiration date.</p>
						)}
					</div>
				</section>
			</div>
		</div>
	);
};

export default ProposalPage;
