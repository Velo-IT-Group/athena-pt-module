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
import { getComments, getProducts, getProposal, getUser } from '@/lib/functions/read';
import { getCurrencyString } from '@/utils/money';
import Navbar from '@/components/Navbar';
import { Textarea } from '@/components/ui/textarea';
import SubmitButton from '@/components/SubmitButton';
import { calculateTotals } from '@/utils/helpers';
import { createComment } from '@/lib/functions/create';
import { updateComment } from '@/lib/functions/update';
import { cn } from '@/lib/utils';

type Props = {
	params: { id: string };
};

const ProposalReviewPage = async ({ params }: Props) => {
	const proposal = await getProposal(params.id);
	const products = await getProducts(params.id);
	const comments = await getComments(params.id);

	if (!proposal || !products) return <div></div>;

	const { productTotal, totalPrice, laborTotal } = calculateTotals(products, proposal.phases, proposal.labor_rate);

	const user = await getUser();

	return (
		<div className='bg-neutral-50 flex-1 min-h-screen'>
			<Navbar title={proposal.name} org=''>
				{user && (
					<Button className='mr-2' variant='outline'>
						Revise
					</Button>
				)}
				<Dialog>
					<DialogTrigger asChild>
						<Button className='mr-2'>Approve</Button>
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
				<div className='grid grid-cols-5 gap-12 py-12 container'>
					<div className='col-span-3'>
						<div className='space-y-4'>
							<h1 className='text-lg font-semibold'>Proposal breakdown</h1>
							<p className='text-sm text-muted-foreground'>
								Based on your proposal, you can see what you&apos;ll be able to expect as your monthly expense.
							</p>

							<div className='rounded-xl border bg-neutral-100 p-4 space-y-4'>
								<div className='flex items-center justify-between px-4'>
									<p className='text-sm text-muted-foreground'>Quote Price</p>
									<p className='text-sm text-muted-foreground text-right'>
										<span className='font-medium'>{getCurrencyString(totalPrice!)}</span>
									</p>
								</div>

								{products.length > 0 && (
									<Card>
										<CardHeader>
											<CardTitle>Hardware</CardTitle>
										</CardHeader>
										<CardContent className='space-y-2.5'>
											<div className={`flex items-center gap-6 justify-between`}>
												<div className='max-w-96'>
													<span className='text-sm text-muted-foreground'>Description</span>
												</div>
												<div className='grid gap-2 justify-items-end' style={{ gridTemplateColumns: '100px 125px' }}>
													<span className='text-sm text-muted-foreground'>Quantity</span>
													<span className='text-sm text-muted-foreground'>Extended Price</span>
												</div>
											</div>
											{products?.map((hardwareItem) => (
												<>
													<Separator />
													<div key={hardwareItem.id} className='flex items-center gap-6 justify-between'>
														<div className='max-w-96'>
															<div className='font-medium text-sm truncate'>{hardwareItem.description}</div>
															<div className='text-muted-foreground text-sm'>{getCurrencyString(hardwareItem.price!)}</div>
														</div>
														{/* <div className='grid gap-2' style={{ gridTemplateColumns: '60px 1fr' }}>
														<p className='text-sm text-muted-foreground hover:underline line-clamp-1 text-center'>{hardwareItem.quantity}</p>
														<p className='text-sm text-muted-foreground hover:underline line-clamp-1'>{hardwareItem.description}</p>
													</div> */}
														<div className='grid gap-2' style={{ gridTemplateColumns: '100px 125px' }}>
															<p className='text-sm text-muted-foreground text-right'>{hardwareItem.quantity}</p>
															<p className='text-sm text-muted-foreground text-right'>
																<span className='font-medium'>{getCurrencyString(hardwareItem.price! * hardwareItem.quantity!)}</span>
															</p>
														</div>
													</div>
												</>
											))}
										</CardContent>
										<Separator className='mb-6' />
										<CardFooter>
											<div className='flex items-center justify-between w-full'>
												<p className='text-sm text-muted-foreground font-bold'>Hardware Subtotal</p>
												<p className='text-sm text-muted-foreground text-right'>
													<span className='font-medium'>{getCurrencyString(productTotal)}</span>
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
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.labor_hours!}</p>
										</div>
										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Sales Work</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.sales_hours!}</p>
										</div>
										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Project Management</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.management_hours!}</p>
										</div>
										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Hours Required</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.hours_required!}</p>
										</div>
										{/* <div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Labor Rate</p>
											<p className='text-sm text-muted-foreground text-right'>
												<span className='font-medium'>{getCurrencyString(proposal.labor_rate!)}</span>
											</p>
										</div> */}
										<Separator />
										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Services Subtotal</p>
											<p className='text-sm text-muted-foreground text-right'>
												<span className='font-medium'>{getCurrencyString(laborTotal)}</span>
											</p>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>

					<Card className='col-span-2'>
						<CardHeader>
							<CardTitle>Scope Of Work</CardTitle>
						</CardHeader>

						<CardContent>
							<div className='space-y-4'>
								<Separator />
								{proposal?.phases?.map((phase) => {
									const comment = comments.find((c) => c.phase === phase.id);
									return (
										<div className='space-y-4' key={phase.id}>
											<div className='flex items-center gap-2'>
												<h3 className='font-medium tracking-tight'>
													{phase.description} - {phase.hours}hrs
												</h3>
												<Dialog>
													<DialogTrigger asChild>
														<Button
															size='icon'
															variant='link'
															className={(cn('transition-opacity hover:opacity-100'), comment?.text ? 'opacity-100' : 'opacity-0 ')}
														>
															<Pencil1Icon className='w-4 h-4' />
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>{phase.description}</DialogTitle>
														</DialogHeader>
														<form>
															<div className='grid w-full items-center gap-4'>
																<div className='flex flex-col space-y-1.5'>
																	<Label htmlFor='text'>Comment</Label>
																	<Textarea
																		name='text'
																		placeholder='Add a comment to this section'
																		defaultValue={comment?.text}
																		className='min-h-40'
																	/>
																</div>
															</div>
															<DialogFooter>
																<SubmitButton
																	className='mt-4'
																	formAction={async (data: FormData) => {
																		'use server';
																		const text = data.get('text') as string;
																		console.log(text);
																		if (comment) {
																			await updateComment(comment?.id, { text });
																		} else {
																			await createComment({ proposal: proposal.id, text, user: user?.id });
																		}
																	}}
																>
																	{comment ? 'Update' : 'Comment'}
																</SubmitButton>
															</DialogFooter>
														</form>
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
									);
								})}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ProposalReviewPage;
