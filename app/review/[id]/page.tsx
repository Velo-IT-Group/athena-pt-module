'use server';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, PaperPlaneIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getProposal } from '@/lib/data';
import { getCurrencyString } from '@/utils/money';
import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { Textarea } from '@/components/ui/textarea';
import SubmitButton from '@/components/SubmitButton';

const discussion = [
	{
		id: '12345',
		name: 'Nick',
		body: 'Hey @Jeff, is this really necessary?',
	},
	{
		id: '123456',
		name: 'Jeff',
		body: 'Hey @Nick, yes, this is very necessary.',
	},
	{
		id: '1234567',
		name: 'Nick',
		body: 'Okay',
	},
];

type Props = {
	params: { id: string };
};

const ProposalReviewPage = async ({ params }: Props) => {
	const proposal = await getProposal(params.id);
	const supabase = createClient();
	const { data: products, error } = await supabase.from('products').select().eq('proposal', params.id);

	if (!proposal || error) return <div>{JSON.stringify(error, null, 2)}</div>;

	return (
		<div className='bg-neutral-50 flex-1 h-screen'>
			<Navbar title={proposal.name} org=''>
				<Button className='ml-auto' variant='outline'>
					Revise
				</Button>
				<Dialog>
					<DialogTrigger asChild>
						<Button>Approve</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your account and remove your data from our servers.
							</DialogDescription>
						</DialogHeader>
						<form>
							<div className='grid w-full items-center gap-4'>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='name'>Initals</Label>
									<Input id='name' placeholder='Name of your project' />
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='name'>Name</Label>
									<Input id='name' placeholder='Name of your project' />
								</div>
							</div>
						</form>
						<DialogFooter>
							<Button type='submit'>Sign</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</Navbar>
			<div className='border-t'>
				<div className='grid grid-cols-5 gap-24 py-12 container'>
					<div className='col-span-2'>
						<div className='space-y-4'>
							<h1 className='text-lg font-semibold'>Quote breakdown</h1>
							<p className='text-sm text-muted-foreground'>
								Based on your proposal, you can see what you&apos;ll be able to expect as your monthly expense.
							</p>

							<div className='rounded-xl border bg-neutral-100 p-4 space-y-4'>
								<div className='flex items-center justify-between px-4'>
									<p className='text-sm text-muted-foreground'>Quote Price</p>
									<p className='text-sm text-muted-foreground text-right'>
										<span className='font-medium'>{getCurrencyString(proposal.total_price ?? 0)}</span>
									</p>
								</div>

								{products.length > 0 && (
									<Card>
										<CardHeader>
											<CardTitle>Hardware</CardTitle>
										</CardHeader>
										<CardContent className='space-y-2'>
											{products?.map((hardwareItem) => (
												<HoverCard key={hardwareItem.id}>
													<HoverCardTrigger asChild>
														<div className={`flex items-center justify-between`}>
															<p className='text-sm text-muted-foreground hover:underline'>{hardwareItem.id}</p>
															<p className='text-sm text-muted-foreground text-right'>
																<span className='font-medium'>{getCurrencyString(hardwareItem.price ?? 0)}</span>
															</p>
														</div>
													</HoverCardTrigger>
													<HoverCardContent className='w-80 flex flex-1 flex-col'>
														<h4>Discussion</h4>
														<ScrollArea className='space-y-4 h-80'>
															{discussion.map((message) => (
																<div key={message.id} className='flex justify-between space-x-4 border-b p-4 last:border-b-0'>
																	<Avatar>
																		<AvatarImage src='https://github.com/vercel.png' />
																		<AvatarFallback>VC</AvatarFallback>
																	</Avatar>
																	<div className='space-y-1'>
																		<h4 className='text-sm font-semibold'>@nextjs</h4>
																		<p className='text-sm'>The React Framework – created and maintained by @vercel.</p>
																		<div className='flex items-center pt-2'>
																			<CalendarIcon className='mr-2 h-4 w-4 opacity-70' />{' '}
																			<span className='text-xs text-muted-foreground'>Joined December 2021</span>
																		</div>
																	</div>
																</div>
															))}
														</ScrollArea>
														<form className='flex w-full max-w-sm items-center space-x-2'>
															<Input id='message' name='message' placeholder='Send message...' />
															<Button type='submit' variant='outline' size='sm'>
																<PaperPlaneIcon className='w-4 h-4' />
															</Button>
														</form>
													</HoverCardContent>
												</HoverCard>
											))}
										</CardContent>

										<CardFooter>
											<div className='flex items-center justify-between w-full'>
												<p className='text-sm text-muted-foreground'>Hardware Subtotal</p>
												<p className='text-sm text-muted-foreground text-right'>
													<span className='font-medium'>{getCurrencyString(proposal.total_product_price ?? 0)}</span>
												</p>
											</div>
										</CardFooter>
									</Card>
								)}

								<Card>
									<CardHeader>
										<CardTitle>Services</CardTitle>
									</CardHeader>
									<CardContent className='space-y-2'>
										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Total Labor Hours</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.labor_hours ?? 0}</p>
										</div>
										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Sales Work</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.sales_hours ?? 0}</p>
										</div>
										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Project Management</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.management_hours ?? 0}</p>
										</div>
										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Hours Required</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.hours_required ?? 0}</p>
										</div>
										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Labor Rate</p>
											<p className='text-sm text-muted-foreground text-right'>
												<span className='font-medium'>{getCurrencyString(proposal.labor_rate ?? 0)}</span>
											</p>
										</div>
										<Separator />
										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Services Subtotal</p>
											<p className='text-sm text-muted-foreground text-right'>
												<span className='font-medium'>{getCurrencyString(proposal.total_labor_price)}</span>
											</p>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>

					<Card className='col-span-3'>
						<CardHeader>
							<CardTitle>Scope Of Work</CardTitle>
						</CardHeader>

						<CardContent>
							<div className='space-y-4'>
								<Separator />
								{proposal.sections.map((section) => (
									<div key={section.id} className='space-y-2'>
										{section?.phases?.map((phase) => (
											<div className='space-y-4' key={phase.id}>
												<div className='flex items-center gap-2'>
													<h3 className='font-medium tracking-tight'>
														{phase.description} - {phase.hours}hrs
													</h3>
													<Dialog>
														<DialogTrigger asChild>
															<Button size='icon' variant='link' className='opacity-0 transition-opacity hover:opacity-100 '>
																<Pencil1Icon className='w-4 h-4' />
															</Button>
														</DialogTrigger>
														<DialogContent>
															<DialogHeader>
																<DialogTitle>{phase.description}</DialogTitle>
															</DialogHeader>
															<form className='overflow-scroll'>
																<div className='grid w-full items-center gap-4'>
																	<div className='flex flex-col space-y-1.5'>
																		<Label htmlFor='comment'>Comment</Label>
																		<Textarea id='comment' placeholder='Add a comment to this section' className='min-h-40' />
																	</div>
																</div>
															</form>
															<DialogFooter>
																<SubmitButton>Comment</SubmitButton>
															</DialogFooter>
														</DialogContent>
													</Dialog>
												</div>

												<ul className='list-disc list-inside px-4'>
													{phase.tickets.map((ticket) => (
														<li key={ticket.id} className='text-sm'>
															{ticket.summary}
														</li>
													))}
												</ul>
											</div>
										))}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ProposalReviewPage;
