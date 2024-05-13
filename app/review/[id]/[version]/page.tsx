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
import { Metadata, ResolvingMetadata } from 'next';
import { getTicket } from '@/utils/manage/read';
import ProductListItem from './product-list-item';
import ProductCard from './product-card';

type Props = {
	params: { id: string; version: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	const { id, version } = params;
	const proposal = await getProposal(id, version);
	return {
		title: `Review - ${proposal?.name}`,
	};
}

const ProposalReviewPage = async ({ params }: Props) => {
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
									return <ProductCard key={section.id} title={section.name} products={section.products} />;
								})}

								{proposal.working_version.products && proposal.working_version.products.length > 0 && (
									<ProductCard title={'Miscellanous'} products={proposal.working_version.products?.filter((p) => !!!p.section)} />
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

export default ProposalReviewPage;
