import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { getPhases, getProducts, getProposal, getSections, getVersion, getVersions } from '@/lib/functions/read';
import { getCurrencyString } from '@/utils/money';
import Navbar from '@/components/Navbar';
import { calculateTotals } from '@/utils/helpers';
import ApprovalForm from './approval-form';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { getTicket } from '@/utils/manage/read';
import ProductCard from './product-card';
import ExpiredProposal from './expired-proposal';

type Props = {
	params: { id: string; version: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	const { id } = params;
	const proposal = await getProposal(id);
	return {
		title: `Review - ${proposal?.name}`,
	};
}

const ProposalReviewPage = async ({ params }: Props) => {
	const [proposal, products, sections, phases, version] = await Promise.all([
		getProposal(params.id),
		getProducts(params.version),
		getSections(params.version),
		getPhases(params.version),
		getVersion(params.version),
	]);

	if (!proposal || !products) return notFound();

	// Convert the proposal string date to a Date object
	const proposalExpirationDate = new Date(proposal.expiration_date ?? '');
	const today = new Date(); // Get today's date

	const ticket = await getTicket(proposal?.service_ticket ?? 0);

	const { recurringTotal, laborTotal, totalPrice } = calculateTotals(
		sections.flatMap((s) => s.products),
		phases ?? [],
		proposal.labor_rate
	);

	const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	const dateToCompareWithoutTime = new Date(
		proposalExpirationDate.getFullYear(),
		proposalExpirationDate.getMonth(),
		proposalExpirationDate.getDate()
	);

	return (
		<div className='relative bg-secondary/25 dark:bg-background flex-1 min-h-screen'>
			{todayWithoutTime > dateToCompareWithoutTime && <ExpiredProposal />}

			<div className='absolute p-4 z-50 grid place-items-center bg-black/25 h-screen w-screen backdrop-blur-md sm:hidden'>
				<div className='bg-card p-4 rounded-md text-center'>
					<h1 className='text-lg font-semibold'>Please use computer browser</h1>
					<p>Please use a screen that&apos;s bigger than 450px.</p>
				</div>
			</div>

			<Navbar
				title={proposal.name}
				org=''
				version={version && version.number && version?.number > 0 ? version?.number : undefined}
			>
				<Dialog>
					<DialogTrigger asChild>
						<Button className='mr-2'>Approve</Button>
					</DialogTrigger>

					<ApprovalForm proposal={proposal} />
				</Dialog>
			</Navbar>

			<div className='border-t'>
				<div className='grid items-start gap-6 py-6 sm:grid-cols-5 sm:gap-12 sm:py-12 container'>
					<div className='sm:col-span-3'>
						<div className='space-y-4'>
							<h1 className='text-lg font-semibold'>Proposal breakdown</h1>

							<div className='rounded-xl border bg-secondary/50 dark:bg-card/50 p-4 space-y-4'>
								{sections?.map((section) => {
									return (
										<ProductCard
											key={section.id}
											title={section.name}
											products={section.products}
										/>
									);
								})}

								<Card>
									<CardHeader>
										<CardTitle>Overview</CardTitle>
									</CardHeader>

									<CardContent className='space-y-2.5'>
										<div className='grid gap-2 grid-cols-7'>
											<div className='max-w-96 col-span-4'>
												<span className='text-sm text-muted-foreground'>Description</span>
											</div>
											<div className='grid gap-2 justify-items-end grid-cols-5 col-span-3'>
												<span className='text-sm text-muted-foreground text-right col-span-2'>Recurring Price</span>
												<span className='text-sm text-muted-foreground col-span-3 text-right whitespace-nowrap'>
													Non-Recurring Price
												</span>
											</div>
										</div>
										{sections.map((section) => {
											const { productTotal: sectionProductSubTotal, recurringTotal: sectionRecurringProductSubTotal } =
												calculateTotals(section.products, [], 250);

											return (
												<>
													<Separator key={section.id} />

													<div
														className='grid gap-2 grid-cols-7'
														key={section.id}
													>
														<div className='font-medium text-sm col-span-4'>{section.name} Total</div>

														<div className='grid gap-2 justify-items-end grid-cols-3 col-span-3'>
															<p className='text-sm text-muted-foreground text-right'>
																{getCurrencyString(sectionRecurringProductSubTotal)}
																/mo
															</p>
															<p className='text-sm text-muted-foreground text-right col-span-2'>
																{getCurrencyString(sectionProductSubTotal)}
															</p>
														</div>
													</div>
												</>
											);
										})}

										<Separator />

										<div className='grid gap-2 grid-cols-7'>
											<div className='font-medium text-sm col-span-4'>Services Total</div>

											<div className='grid gap-2 justify-items-end grid-cols-3 col-span-3'>
												<p className='text-sm text-muted-foreground text-right'>
													{getCurrencyString(0)}
													/mo
												</p>
												<p className='text-sm text-muted-foreground text-right col-span-2'>
													{getCurrencyString(laborTotal)}
												</p>
											</div>
										</div>

										<Separator />

										<div className='grid gap-2 grid-cols-7'>
											<p className='text-sm text-muted-foreground col-span-4'>Total</p>
											<div className='grid gap-2 justify-items-end grid-cols-3 col-span-3'>
												<p className='text-sm text-muted-foreground text-right'>
													<span className='font-medium'>{getCurrencyString(recurringTotal)}/mo</span>
												</p>
												<p className='text-sm text-muted-foreground text-right col-span-2'>
													<span className='font-medium'>{getCurrencyString(totalPrice)}</span>
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							<p className='text-sm text-muted-foreground pr-4'>
								Taxes, shipping, handling and other fees may apply. We reserve the right to cancel orders arising from
								pricing or other errors.
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
									<div
										className='space-y-4'
										key={phase.id}
									>
										<div className='flex items-center gap-2'>
											<h3 className='font-medium tracking-tight'>
												{phase.description} - {phase.hours}hrs
											</h3>
										</div>

										<ul className='list-disc list-inside px-4'>
											{phase.tickets?.map((ticket) => (
												<li
													key={ticket.id}
													className='text-sm'
												>
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

export default ProposalReviewPage;
