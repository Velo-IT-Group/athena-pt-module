import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { getProducts, getProposal, getSections, getUser } from '@/lib/functions/read';
import { getCurrencyString } from '@/utils/money';
import Navbar from '@/components/Navbar';
import { calculateTotals } from '@/utils/helpers';
import ApprovalForm from './approval-form';
import { notFound } from 'next/navigation';
import ProposalBreakdown from './proposal-breakdown';

type Props = {
	params: { id: string };
};

const ProposalReviewPage = async ({ params }: Props) => {
	const proposal = await getProposal(params.id);
	const products = await getProducts(params.id);
	const sections = await getSections(params.id);

	if (!proposal || !products) return notFound();

	const { productTotal, totalPrice, laborTotal, laborHours } = calculateTotals(
		products,
		// @ts-ignore
		proposal.phases,
		proposal.labor_rate,
		proposal.management_hours,
		proposal.sales_hours
	);

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

					<ApprovalForm id={proposal.id} />
				</Dialog>
			</Navbar>

			<div className='border-t'>
				<div className='grid gap-6 py-6 sm:grid-cols-5 sm:gap-12 sm:py-12 container'>
					<div className='sm:col-span-3'>
						<div className='space-y-4'>
							<h1 className='text-lg font-semibold'>Proposal breakdown</h1>

							<p className='text-sm text-muted-foreground'>
								Based on your proposal, you can see what you&apos;ll be able to expect as your monthly expense.
							</p>

							<div className='rounded-xl border bg-neutral-100 p-4 space-y-4'>
								<div className='flex flex-col items-start sm:flex-row sm:items-center sm:justify-between px-4'>
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
										<CardContent className='p-6 text-sm'>
											{/* <div className='hidden sm:flex items-center gap-6 justify-between'>
												<div className='max-w-96'>
													<span className='text-sm text-muted-foreground'>Description</span>
												</div>
												<div className='grid gap-2 justify-items-end grid-cols-[100px_125px]'>
													<span className='text-sm text-muted-foreground'>Quantity</span>
													<span className='text-sm text-muted-foreground'>Extended Price</span>
												</div>
											</div> */}

											{/* {products?.map((hardwareItem) => (
												<>
													<Separator />
													<div key={hardwareItem.id} className='flex flex-col sm:flex-row sm:items-start gap-6 justify-between'>
														<div className='max-w-96'>
															<div className='font-medium text-sm line-clamp-1'>{hardwareItem.description}</div>
															<div className='flex items-center w-full'>
																<div className='text-muted-foreground text-sm'>{getCurrencyString(hardwareItem.price!)} </div>
																<p className='sm:hidden text-right mx-2'>•</p>
																<p className='sm:hidden text-sm text-muted-foreground text-right'>{hardwareItem.quantity}</p>
																<p className='sm:hidden text-sm text-muted-foreground text-right ml-auto'>
																	<span className='font-medium'>{getCurrencyString(hardwareItem.price! * hardwareItem.quantity!)}</span>
																</p>
															</div>
														</div>
														<div className='grid gap-2' style={{ gridTemplateColumns: '60px 1fr' }}>
														<p className='text-sm text-muted-foreground hover:underline line-clamp-1 text-center'>{hardwareItem.quantity}</p>
														<p className='text-sm text-muted-foreground hover:underline line-clamp-1'>{hardwareItem.description}</p>
													</div>
														<div className='hidden sm:grid gap-2 sm:grid-cols-[100px_125px]'>
															<p className='text-sm text-muted-foreground text-right'>{hardwareItem.quantity}</p>
															<p className='text-sm text-muted-foreground text-right'>
																<span className='font-medium'>{getCurrencyString(hardwareItem.price! * hardwareItem.quantity!)}</span>
															</p>
														</div>
													</div>
												</>
											))} */}

											{sections?.map((section, index) => (
												<div className='grid gap-3' key={section.id}>
													<div className='font-semibold'>{section.name}</div>

													<ul className='grid gap-3'>
														{section.products.map((product) => (
															<li key={product.id} className='flex items-center justify-between'>
																<span className='text-muted-foreground'>
																	{product.description} x <span>{product.quantity}</span>
																</span>
																<span>
																	{getCurrencyString((product.price || 0) * product.quantity)}
																	{product.recurring_flag && product.recurring_cycle_type === 'CalendarYear' && '/mo'}
																</span>
															</li>
														))}
													</ul>

													{sections.length === index - 1 && <Separator className='my-2' />}
												</div>
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

									<CardContent className='space-y-2 text-sm'>
										<ul className='grid gap-3'>
											{sections.map((section) => {
												const totalPrice = section.products.reduce((accumulator, currentValue) => {
													return (accumulator ?? 0) + (currentValue.price ?? 0);
												}, 0);
												return (
													<li key={section.id} className='flex items-center justify-between'>
														<span className='text-muted-foreground'>{section.name} Total</span>
														<span>{getCurrencyString(totalPrice)}</span>
													</li>
												);
											})}
										</ul>

										{/* <div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Total Labor Hours</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{laborHours} hrs</p>
										</div>

										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Sales Work</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.sales_hours!} hrs</p>
										</div>

										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Project Management</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.management_hours!} hrs</p>
										</div>

										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Hours Required</p>
											<p className='text-sm text-muted-foreground text-right font-medium'>{proposal.hours_required!} hrs</p>
										</div> */}

										<li className='flex items-center justify-between'>
											<span className='text-muted-foreground'>Labor</span>
											<span>{getCurrencyString(laborTotal)}</span>
										</li>

										<li className='flex items-center justify-between font-semibold'>
											<span className='text-muted-foreground'>Total</span>
											<span>{getCurrencyString(totalPrice)}</span>
										</li>

										{/* <Separator />

										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Services Subtotal</p>
											<p className='text-sm text-muted-foreground text-right'>
												<span className='font-medium'>{getCurrencyString(laborTotal)}</span>
											</p>
										</div> */}
									</CardContent>
								</Card>
							</div>
						</div>
					</div>

					<ProposalBreakdown className='sm:col-span-2' proposal={proposal} sections={sections ?? []} />

					{/* <Card className='sm:col-span-2'>
						<CardHeader>
							<CardTitle>Scope Of Work</CardTitle>
						</CardHeader>

						<CardContent>
							<div className='space-y-4'>
								<Separator />
								{proposal?.phases?.map((phase) => (
									<div className='space-y-4' key={phase.id}>
										<div className='flex items-center gap-2'>
											<h3 className='font-medium tracking-tight'>
												{phase.description} - {phase.hours}hrs
											</h3>
										</div>

										<ul className='list-disc list-inside px-4'>
											{phase.tickets?.map((ticket) => (
												<li key={ticket.id} className='text-sm'>
													{ticket.summary}
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</CardContent>
					</Card> */}
				</div>
			</div>
		</div>
	);
};

export default ProposalReviewPage;
