import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { getPhases, getProducts, getProposal, getSections, getUser } from '@/lib/functions/read';
import { getCurrencyString } from '@/utils/money';
import Navbar from '@/components/Navbar';
import { calculateTotals } from '@/utils/helpers';
import ApprovalForm from './approval-form';
import { notFound } from 'next/navigation';
import { getTicket } from '@/utils/manage/read';
import ProductListItem from './product-list-item';
import { Props } from './page';

export const ProposalReviewPage = async ({ params }: Props) => {
	const [proposal, products, sections, phases] = await Promise.all([
		getProposal(params.id, params.version),
		getProducts(params.id),
		getSections(params.version),
		getPhases(params.version),
	]);

	if (!proposal || !products) return notFound();

	const ticket = await getTicket(proposal?.service_ticket ?? 0);

	const { productTotal, totalPrice, laborTotal } = calculateTotals(
		[...products, ...sections.flatMap((s) => s.products)],
		phases ?? [],
		proposal.labor_rate
	);

	const user = await getUser();

	return (
		<div className='bg-secondary/25 dark:bg-background flex-1 min-h-screen'>
			<Navbar title={proposal.name} org='' version={proposal.working_version.number ? proposal.working_version.number : undefined}>
				<Dialog>
					<DialogTrigger asChild>
						<Button className='mr-2'>Approve</Button>
					</DialogTrigger>

					<ApprovalForm proposal={proposal} ticket={ticket} />
				</Dialog>
			</Navbar>

			<div className='border-t'>
				<div className='grid items-start gap-6 py-6 sm:grid-cols-5 sm:gap-12 sm:py-12 container'>
					<div className='sm:col-span-3'>
						<div className='space-y-4'>
							<h1 className='text-lg font-semibold'>Proposal breakdown</h1>

							<div className='rounded-xl border bg-secondary/50 dark:bg-card/50 p-4 space-y-4'>
								{sections?.map((section) => {
									const sectionProductSubTotal = section.products
										.filter((p) => !p.recurring_flag || p.recurring_bill_cycle !== 2)
										.reduce((accumulator, currentValue) => {
											const price: number | null = currentValue.product_class === 'Bundle' ? currentValue.calculated_price : currentValue.price;

											return accumulator + (price ?? 0) * (currentValue?.quantity ?? 0);
										}, 0);

									const sectionProductRecurringSubTotal = section.products
										.filter((p) => p.recurring_flag && p.recurring_bill_cycle === 2)
										.reduce((accumulator, currentValue) => {
											const price: number | null = currentValue.product_class === 'Bundle' ? currentValue.calculated_price : currentValue.price;

											return accumulator + (price ?? 0) * (currentValue?.quantity ?? 0);
										}, 0);

									return (
										<Card key={section.id}>
											<CardHeader>
												<CardTitle>{section.name}</CardTitle>
											</CardHeader>

											<CardContent className='space-y-2.5'>
												<div className='hidden sm:flex items-center gap-6 justify-between'>
													<div className='max-w-96'>
														<span className='text-sm text-muted-foreground'>Description / Unit Price</span>
													</div>
													<div className='grid gap-2 justify-items-end grid-cols-[100px_125px]'>
														<span className='text-sm text-muted-foreground'>Quantity</span>
														<span className='text-sm text-muted-foreground'>Extended Price</span>
													</div>
												</div>

												{section.products?.map((product) => (
													<ProductListItem key={product.id} product={product} />
												))}
											</CardContent>

											<Separator className='mb-6' />

											<CardFooter className='grid gap-1.5'>
												{sectionProductSubTotal > 0 && (
													<div className='flex items-center justify-between'>
														<p className='text-sm text-muted-foreground'>{section.name} Product Subtotal</p>
														<p className='text-sm text-muted-foreground text-right'>
															<span className='font-medium'>{getCurrencyString(sectionProductSubTotal)}</span>
														</p>
													</div>
												)}

												{sectionProductRecurringSubTotal > 0 && (
													<div className='flex items-center justify-between'>
														<p className='text-sm text-muted-foreground'>{section.name} Recurring Subtotal</p>
														<p className='text-sm text-muted-foreground text-right'>
															<span className='font-medium'>{getCurrencyString(sectionProductRecurringSubTotal)}/mo</span>
														</p>
													</div>
												)}
											</CardFooter>
										</Card>
									);
								})}

								{proposal.working_version.products && proposal.working_version.products.length > 0 && (
									<Card>
										<CardHeader>
											<CardTitle>Miscellanous</CardTitle>
										</CardHeader>

										<CardContent className='space-y-2.5'>
											<div className='hidden sm:flex items-center gap-6 justify-between'>
												<div className='max-w-96'>
													<span className='text-sm text-muted-foreground'>Description / Unit Price</span>
												</div>
												<div className='grid gap-2 justify-items-end grid-cols-[100px_125px]'>
													<span className='text-sm text-muted-foreground'>Quantity</span>
													<span className='text-sm text-muted-foreground'>Extended Price</span>
												</div>
											</div>

											{proposal.working_version.products
												?.filter((p) => !!!p.section)
												.map((product) => (
													<ProductListItem key={product.id} product={product} />
												))}
										</CardContent>

										<Separator className='mb-6' />

										<CardFooter className='grid gap-1.5'>
											{proposal.working_version.products
												.filter((p) => !p.recurring_flag || p.recurring_bill_cycle !== 2)
												.reduce((accumulator, currentValue) => {
													const price: number | null = currentValue.product_class === 'Bundle' ? currentValue.calculated_price : currentValue.price;

													return accumulator + (price ?? 0) * (currentValue?.quantity ?? 0);
												}, 0) > 0 && (
												<div className='flex items-center justify-between'>
													<p className='text-sm text-muted-foreground'>Miscellaneous Product Subtotal</p>
													<p className='text-sm text-muted-foreground text-right'>
														<span className='font-medium'>
															{getCurrencyString(
																proposal.working_version.products
																	.filter((p) => !p.recurring_flag || p.recurring_bill_cycle !== 2)
																	.reduce((accumulator, currentValue) => {
																		const price: number | null =
																			currentValue.product_class === 'Bundle' ? currentValue.calculated_price : currentValue.price;

																		return accumulator + (price ?? 0) * (currentValue?.quantity ?? 0);
																	}, 0)
															)}
														</span>
													</p>
												</div>
											)}

											{proposal.working_version.products
												.filter((p) => p.recurring_flag && p.recurring_bill_cycle === 2)
												.reduce((accumulator, currentValue) => {
													const price: number | null = currentValue.product_class === 'Bundle' ? currentValue.calculated_price : currentValue.price;

													return accumulator + (price ?? 0) * (currentValue?.quantity ?? 0);
												}, 0) > 0 && (
												<div className='flex items-center justify-between'>
													<p className='text-sm text-muted-foreground'>Miscellanous Recurring Subtotal</p>
													<p className='text-sm text-muted-foreground text-right'>
														<span className='font-medium'>
															{getCurrencyString(
																proposal.working_version.products
																	.filter((p) => p.recurring_flag && p.recurring_bill_cycle === 2)
																	.reduce((accumulator, currentValue) => {
																		const price: number | null =
																			currentValue.product_class === 'Bundle' ? currentValue.calculated_price : currentValue.price;

																		return accumulator + (price ?? 0) * (currentValue?.quantity ?? 0);
																	}, 0)
															)}
															/mo
														</span>
													</p>
												</div>
											)}
										</CardFooter>
									</Card>
								)}

								<Card>
									<CardHeader>
										<CardTitle>Overview</CardTitle>
									</CardHeader>

									<CardContent className='space-y-2'>
										{sections.map((section) => {
											const sectionProductSubTotal = section.products
												.filter((p) => !p.recurring_flag)
												.reduce((accumulator, currentValue) => {
													const price: number | null = currentValue.product_class === 'Bundle' ? currentValue.calculated_price : currentValue.price;

													return accumulator + (price ?? 0) * (currentValue?.quantity ?? 0);
												}, 0);
											return (
												<div key={section.id} className='flex items-center justify-between'>
													<p className='text-sm text-muted-foreground'>{section.name} Total</p>
													<p className='text-sm text-muted-foreground text-right font-medium'>{getCurrencyString(sectionProductSubTotal)}</p>
												</div>
											);
										})}

										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Labor</p>
											<p className='text-sm text-muted-foreground text-right'>
												<span className='font-medium'>{getCurrencyString(laborTotal)}</span>
											</p>
										</div>

										<Separator />

										<div className='flex items-center justify-between'>
											<p className='text-sm text-muted-foreground'>Total</p>
											<p className='text-sm text-muted-foreground text-right'>
												<span className='font-medium'>{getCurrencyString(productTotal)}</span>
											</p>
										</div>
									</CardContent>
								</Card>

								<div className='flex flex-col items-start sm:flex-row sm:items-center sm:justify-between px-4'>
									<p className='text-sm text-muted-foreground'>Quote Price</p>
									<p className='text-sm text-muted-foreground text-right'>
										<span className='font-medium'>{getCurrencyString(totalPrice!)}</span>
									</p>
								</div>
							</div>

							<p className='text-sm text-muted-foreground pr-4'>
								Taxes, shipping, handling and other fees may apply. We reserve the right to cancel orders arising from pricing or other errors.
							</p>
						</div>
					</div>

					<Card className='sm:col-span-2'>
						<CardHeader>
							<CardTitle>Scope Of Work</CardTitle>
						</CardHeader>

						<CardContent>
							<div className='space-y-4'>
								<Separator />
								{phases?.map((phase) => (
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
					</Card>
				</div>
			</div>
		</div>
	);
};
