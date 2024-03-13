import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProducts, getProposal, getTicket, getTicketNotes } from '@/lib/functions/read';
import { relativeDate } from '@/utils/date';
import { getCurrencyString } from '@/utils/money';
import {
	CalendarIcon,
	ChatBubbleIcon,
	DotsHorizontalIcon,
	EnvelopeClosedIcon,
	FileTextIcon,
	GlobeIcon,
	StopwatchIcon,
	TextIcon,
} from '@radix-ui/react-icons';
import React from 'react';
import ProductList from './product-list';
import DatePicker from '@/components/DatePicker';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

type Props = {
	params: { id: string };
};

const ProposalPage = async ({ params }: Props) => {
	const proposal = await getProposal(params.id);
	const products = await getProducts(params.id);

	if (!proposal) return <div></div>;

	const [ticket, notes] = await Promise.all([getTicket(proposal?.service_ticket ?? 0), getTicketNotes(proposal?.service_ticket ?? 0)]);
	const laborTotal = proposal.phases.reduce((accumulator, currentValue) => accumulator + (currentValue?.hours ?? 0) * proposal.labor_rate, 0) ?? 0;
	const productTotal = products.reduce((accumulator, currentValue) => accumulator + (currentValue?.price ?? 0), 0);
	const productCost = products.reduce((accumulator, currentValue) => accumulator + (currentValue?.cost ?? 0), 0);
	const recurringTotal = products
		?.filter((product) => product.recurring_flag)
		.reduce((accumulator, currentValue) => accumulator + (currentValue?.price ?? 0), 0);
	const recurringCost = products
		?.filter((product) => product.recurring_flag)
		.reduce((accumulator, currentValue) => accumulator + (currentValue?.cost ?? 0), 0);
	const totalPrice = laborTotal + productTotal;

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
								<HoverCard>
									<HoverCardTrigger asChild>
										<Button variant='link' size='sm' className='px-0 font-normal h-auto leading-5'>
											Edit customer address
										</Button>
									</HoverCardTrigger>
									<HoverCardContent></HoverCardContent>
								</HoverCard>
							</div>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant='ghost' size='icon'>
										<DotsHorizontalIcon />
									</Button>
								</DialogTrigger>
							</Dialog>
						</div>
						<Separator />
					</div>
				</section>

				<section className='space-y-4'>
					<h2 className='text-xl font-semibold flex items-center justify-between gap-2'>
						Products{' '}
						<div className='font-normal text-sm flex items-center text-muted-foreground'>
							<Switch className='mr-2' /> Collect tax automatically
						</div>
					</h2>
					<div className='space-y-1'>
						<Separator />
						<ProductList products={products} />
						<Separator />
					</div>
				</section>

				<section className='space-y-4 w-1/2'>
					<h2 className='text-xl font-semibold'>Expiration date</h2>
					<div className='space-y-1'>
						<DatePicker />
					</div>
				</section>

				<section className='space-y-4 w-1/2'>
					<h2 className='text-xl font-semibold'>Memo</h2>
					<div className='space-y-1'>
						<Textarea placeholder='Thanks for your business!' />
					</div>
				</section>
			</div>

			<div className='border-l py-16 pl-12 pr-16 w-full col-span-3 space-y-16 bg-muted/50'>
				<div className='space-y-2'>
					<h2 className='text-xl font-semibold'>Summary</h2>
					<p className='text-muted-foreground text-xs uppercase'>Quote exprires {relativeDate(new Date())}</p>
				</div>

				<section className='flex items-start gap-4'>
					<FileTextIcon className='text-primary w-4 h-4' />
					<div className='space-y-3'>
						<h2 className='text-xs'>TOTAL AMOUNT</h2>
						<p className='text-muted-foreground font-medium text-sm uppercase'>{getCurrencyString(productTotal)}</p>
						<p className='text-muted-foreground text-xs'>Bills when quote is accepted</p>
					</div>
				</section>

				<section className='flex items-start gap-4'>
					<StopwatchIcon className='text-muted-foreground w-4 h-4' />
					<div className='space-y-3'>
						<h2 className='text-xs'>LABOR HOURS</h2>
						<p className='text-muted-foreground font-medium text-sm'>{proposal.hours_required} hrs</p>
					</div>
				</section>

				<section className='flex items-start gap-4'>
					<CalendarIcon className='text-primary w-4 h-4' />
					<div className='space-y-3'>
						<h2 className='text-xs'>COMPLETION DATE</h2>
						<p className='text-muted-foreground font-medium text-sm'>{new Intl.DateTimeFormat('en-US', { dateStyle: 'short' }).format(new Date())}</p>
					</div>
				</section>
			</div>
		</div>
	);
};

export default ProposalPage;
