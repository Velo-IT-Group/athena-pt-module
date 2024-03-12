import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProducts, getProposal, getTicket, getTicketNotes } from '@/lib/functions/read';
import { relativeDate } from '@/utils/date';
import { getCurrencyString } from '@/utils/money';
import { ChatBubbleIcon, DotsHorizontalIcon, EnvelopeClosedIcon, GlobeIcon } from '@radix-ui/react-icons';
import React from 'react';

type Props = {
	params: { id: string };
};

function replaceWithBr(text: string) {
	return text.replace(/\n/g, '<br />');
}

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
		<div>
			<div className='col-span-3 grow px-6 py-4 w-full grid justify-start grid-cols-3 gap-4  h-full'>
				<Card>
					<CardHeader className='flex-row items-center justify-between space-y-0'>
						<CardTitle>Company</CardTitle>
						<Button variant='ghost' size='icon'>
							<DotsHorizontalIcon />
						</Button>
					</CardHeader>
					<CardContent className='grid gap-2'>
						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Customer</Label>
							<p>{ticket?.company?.name}</p>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Contact</Label>
							<p>{ticket?.contact?.name}</p>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Phone</Label>
							<p>{ticket?.contact?.phone}</p>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Email</Label>
							<p>{ticket?.contact?.email}</p>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Website</Label>
							<p>{ticket?.company?.website}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Financial</CardTitle>
					</CardHeader>
					<CardContent className='grid gap-2'>
						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Total</Label>
							<p>{getCurrencyString(totalPrice)}</p>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Subtotal</Label>
							<p>{getCurrencyString(totalPrice)}</p>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Cost</Label>
							<p>{getCurrencyString(productCost)}</p>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Recurring</Label>
							<p>{getCurrencyString(recurringTotal)}</p>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Subtotal</Label>
							<p>{getCurrencyString(recurringTotal)}</p>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label className='text-base'>Cost</Label>
							<p>{getCurrencyString(recurringCost)}</p>
						</div>
					</CardContent>
					<CardFooter className='grid grid-cols-3 items-center gap-4 mt-auto'>
						<Label>Gross Profit</Label>
						<p>{getCurrencyString(totalPrice - productCost)}</p>
					</CardFooter>
				</Card>

				<div className='bg-muted/50 h-full p-2 space-y-4'>
					<h2 className='text-lg font-medium'>Conversation</h2>
					<Tabs defaultValue='all'>
						<TabsList>
							<TabsTrigger value='all'>All</TabsTrigger>
							<TabsTrigger value='discussion'>Discussion</TabsTrigger>
							<TabsTrigger value='internal'>Internal</TabsTrigger>
							<TabsTrigger value='resolution'>Resolution</TabsTrigger>
						</TabsList>
						<TabsContent value='discussion' className='space-y-4'>
							{notes
								.filter((note) => note.detailDescriptionFlag)
								.map((note) => (
									<div key={note.id} className='border rounded-md p-4'>
										<div className='flex items-center justify-between'></div>
										{/* <div dangerouslySetInnerHTML={{ __html: note.text }} /> */}
										<div className='whitespace-pre-line'>{note.text}</div>{' '}
									</div>
								))}
						</TabsContent>
						<TabsContent value='internal' className='space-y-4'>
							{notes
								.filter((note) => note.internalFlag)
								.map((note) => (
									<div key={note.id} className='border rounded-md p-4'>
										<div className='flex items-center justify-between'></div>
										{/* <div dangerouslySetInnerHTML={{ __html: note.text }} /> */}
										<div className='whitespace-pre-line'>{note.text}</div>
									</div>
								))}
						</TabsContent>
						<TabsContent value='resolution' className='space-y-4'>
							{notes
								.filter((note) => note.resolutionFlag)
								.map((note) => (
									<div key={note.id} className='grid grid-cols-[20px_1fr] gap-4'>
										<div className='flex flex-col justify-center'>
											<GlobeIcon />
											<Separator dir='vertical' />
										</div>
										{/* <div dangerouslySetInnerHTML={{ __html: note.text }} /> */}
										<div className='whitespace-pre-line'>{note.text}</div>
									</div>
								))}
						</TabsContent>
						<TabsContent value='all' className='space-y-4'>
							{notes.map((note, index) => (
								<div key={note.id} className='grid grid-cols-[24px_1fr] gap-4 items-start justify-stretch'>
									<div className='justify-self-stretch flex flex-col items-center overflow-hidden gap-2 h-full'>
										{note.noteType === 'TicketNote' && <EnvelopeClosedIcon className='flex-shrink-0' />}
										{note.noteType === 'TimeEntryNote' && (
											<div className='bg-primary rounded-full p-1 text-primary-foreground flex-shrink-0 w-6 h-6'>
												<ChatBubbleIcon className='w-4 h-4' />
											</div>
										)}
										<Separator orientation='vertical' className='' />
									</div>
									<Card>
										<CardHeader className='flex-row space-y-0 items-center w-full justify-between'>
											{note.noteType === 'TicketNote' && <CardDescription>Discussion</CardDescription>}
											{note.noteType === 'TimeEntryNote' && <CardDescription>Internal Note</CardDescription>}
											<CardDescription className='text-xs'>{relativeDate(new Date(note._info.sortByDate))}</CardDescription>
										</CardHeader>
										<CardContent>
											<span className='whitespace-pre-line flex-wrap'>{note.text}</span>
										</CardContent>
									</Card>
									{/* <div dangerouslySetInnerHTML={{ __html: note.text }} /> */}
									{/* <div className='whitespace-pre-line'>{note.text}</div> */}
								</div>
							))}
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default ProposalPage;
