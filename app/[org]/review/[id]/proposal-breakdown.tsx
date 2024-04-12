// import { ChevronLeftIcon, ChevronRightIcon, CopyIcon, CreditCard, DotsVerticalIcon, Truck } from '@radix-ui/react-icons';
import { CopyIcon, DotsVerticalIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getCurrencyString } from '@/utils/money';

export default function ProposalBreakdown({
	proposal,
	sections,
	className,
}: {
	proposal: NestedProposal;
	sections: Array<Section & { products: Product[] }>;
	className: string;
}) {
	return (
		<Card className={cn('overflow-hidden', className)}>
			<CardHeader className='bg-muted/40'>
				<CardTitle className='group flex items-center gap-2 text-lg'>Proposal Breakdown</CardTitle>
				<CardDescription>Based on your proposal, you can see what you&apos;ll be able to expect as your monthly expense.</CardDescription>
			</CardHeader>
			<CardContent className='p-6 text-sm'>
				<div className='grid gap-3'>
					{sections.map(({ id, name, products }) => (
						<>
							<div key={id} className='font-semibold'>
								{name}
							</div>

							<ul className='grid gap-3'>
								{products.map((product) => (
									<li key={product.id} className='flex items-center justify-between'>
										<span className='text-muted-foreground'>
											{product.description} x <span>{product.quantity}</span>
										</span>
										<span>{getCurrencyString(product.quantity * (product.price || 0))}</span>
									</li>
								))}
								<li className='flex items-center justify-between'>
									<span className='text-muted-foreground'>
										Aqua Filters x <span>1</span>
									</span>
									<span>$49.00</span>
								</li>
							</ul>
						</>
					))}

					<Separator className='my-2' />

					<ul className='grid gap-3'>
						{sections.map(({ id, name, products }) => {
							const totalPrice = products.reduce((accumulator, currentValue) => {
								return (accumulator ?? 0) + (currentValue.price ?? 0);
							}, 0);
							return (
								<li key={id} className='flex items-center justify-between'>
									<span className='text-muted-foreground'>{name}</span>
									<span>{getCurrencyString(totalPrice)}</span>
								</li>
							);
						})}

						<li className='flex items-center justify-between'>
							<span className='text-muted-foreground'>Labor</span>
							<span>{getCurrencyString(5)}</span>
						</li>

						<li className='flex items-center justify-between'>
							<span className='text-muted-foreground'>Tax</span>
							<span>$25.00</span>
						</li>

						<li className='flex items-center justify-between font-semibold'>
							<span className='text-muted-foreground'>Total</span>
							<span>$329.00</span>
						</li>
					</ul>
				</div>

				<Separator className='my-4' />

				<div className='grid grid-cols-2 gap-4'>
					<div className='grid gap-3'>
						<div className='font-semibold'>Shipping Information</div>
						<address className='grid gap-0.5 not-italic text-muted-foreground'>
							<span>Liam Johnson</span>
							<span>1234 Main St.</span>
							<span>Anytown, CA 12345</span>
						</address>
					</div>
					<div className='grid auto-rows-max gap-3'>
						<div className='font-semibold'>Billing Information</div>
						<div className='text-muted-foreground'>Same as shipping address</div>
					</div>
				</div>
				<Separator className='my-4' />
				<div className='grid gap-3'>
					<div className='font-semibold'>Customer Information</div>
					<dl className='grid gap-3'>
						<div className='flex items-center justify-between'>
							<dt className='text-muted-foreground'>Customer</dt>
							<dd>Liam Johnson</dd>
						</div>
						<div className='flex items-center justify-between'>
							<dt className='text-muted-foreground'>Email</dt>
							<dd>
								<a href='mailto:'>liam@acme.com</a>
							</dd>
						</div>
						<div className='flex items-center justify-between'>
							<dt className='text-muted-foreground'>Phone</dt>
							<dd>
								<a href='tel:'>+1 234 567 890</a>
							</dd>
						</div>
					</dl>
				</div>
				<Separator className='my-4' />
				<div className='grid gap-3'>
					<div className='font-semibold'>Payment Information</div>
					<dl className='grid gap-3'>
						<div className='flex items-center justify-between'>
							<dt className='flex items-center gap-1 text-muted-foreground'>
								{/* <CreditCard className='h-4 w-4' /> */}
								Visa
							</dt>
							<dd>**** **** **** 4532</dd>
						</div>
					</dl>
				</div>
			</CardContent>
			<CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
				<div className='text-xs text-muted-foreground'>
					Updated <time dateTime='2023-11-23'>November 23, 2023</time>
				</div>
				{/* <Pagination className='ml-auto mr-0 w-auto'>
					<PaginationContent>
						<PaginationItem>
							<Button size='icon' variant='outline' className='h-6 w-6'>
								<ChevronLeftIcon className='h-3.5 w-3.5' />
								<span className='sr-only'>Previous Order</span>
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button size='icon' variant='outline' className='h-6 w-6'>
								<ChevronRightIcon className='h-3.5 w-3.5' />
								<span className='sr-only'>Next Order</span>
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination> */}
			</CardFooter>
		</Card>
	);
}
