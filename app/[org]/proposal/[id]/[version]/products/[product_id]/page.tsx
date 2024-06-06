import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { getProduct, getSections } from '@/lib/functions/read';
import { notFound } from 'next/navigation';
import ProductDetailsForm from './product-details-form';

type Props = {
	params: { org: string; id: string; version: string; product_id: string };
};

export default async function Page({ params }: Props) {
	const product = await getProduct(params.product_id);
	const sections = await getSections(params.version);

	if (!product) return notFound();

	return (
		<main className='grid flex-1 auto-rows-max gap-4 p-6'>
			<div className='flex items-center gap-4'>
				<Button variant='outline' size='icon' className='h-7 w-7' asChild>
					<Link href={`/${params.org}/proposal/${params.id}/${params.version}/products`}>
						<ChevronLeftIcon className='h-4 w-4' />

						<span className='sr-only'>Back</span>
					</Link>
				</Button>

				<h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>{product.description}</h1>

				<div className='hidden items-center gap-2 md:ml-auto md:flex'>
					{/* <Button variant='outline' size='sm'>
						Discard
					</Button> */}

					<Button size='sm'>Save Product</Button>
				</div>
			</div>

			<div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
				<div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
					<Card x-chunk='dashboard-07-chunk-0'>
						<CardHeader>
							<CardTitle>Product Details</CardTitle>

							<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
						</CardHeader>

						<ProductDetailsForm product={product} sections={sections} />
					</Card>

					{/* <Card x-chunk='dashboard-07-chunk-1'>
						<CardHeader>
							<CardTitle>Stock</CardTitle>
							<CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='w-[100px]'>SKU</TableHead>
										<TableHead>Stock</TableHead>
										<TableHead>Price</TableHead>
										<TableHead className='w-[100px]'>Size</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell className='font-semibold'>GGPC-001</TableCell>
										<TableCell>
											<Label htmlFor='stock-1' className='sr-only'>
												Stock
											</Label>
											<Input id='stock-1' type='number' defaultValue='100' />
										</TableCell>
										<TableCell>
											<Label htmlFor='price-1' className='sr-only'>
												Price
											</Label>
											<Input id='price-1' type='number' defaultValue='99.99' />
										</TableCell>
										<TableCell>
											<ToggleGroup type='single' defaultValue='s' variant='outline'>
												<ToggleGroupItem value='s'>S</ToggleGroupItem>
												<ToggleGroupItem value='m'>M</ToggleGroupItem>
												<ToggleGroupItem value='l'>L</ToggleGroupItem>
											</ToggleGroup>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className='font-semibold'>GGPC-002</TableCell>
										<TableCell>
											<Label htmlFor='stock-2' className='sr-only'>
												Stock
											</Label>
											<Input id='stock-2' type='number' defaultValue='143' />
										</TableCell>
										<TableCell>
											<Label htmlFor='price-2' className='sr-only'>
												Price
											</Label>
											<Input id='price-2' type='number' defaultValue='99.99' />
										</TableCell>
										<TableCell>
											<ToggleGroup type='single' defaultValue='m' variant='outline'>
												<ToggleGroupItem value='s'>S</ToggleGroupItem>
												<ToggleGroupItem value='m'>M</ToggleGroupItem>
												<ToggleGroupItem value='l'>L</ToggleGroupItem>
											</ToggleGroup>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className='font-semibold'>GGPC-003</TableCell>
										<TableCell>
											<Label htmlFor='stock-3' className='sr-only'>
												Stock
											</Label>
											<Input id='stock-3' type='number' defaultValue='32' />
										</TableCell>
										<TableCell>
											<Label htmlFor='price-3' className='sr-only'>
												Stock
											</Label>
											<Input id='price-3' type='number' defaultValue='99.99' />
										</TableCell>
										<TableCell>
											<ToggleGroup type='single' defaultValue='s' variant='outline'>
												<ToggleGroupItem value='s'>S</ToggleGroupItem>
												<ToggleGroupItem value='m'>M</ToggleGroupItem>
												<ToggleGroupItem value='l'>L</ToggleGroupItem>
											</ToggleGroup>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
						<CardFooter className='justify-center border-t p-4'>
							<Button size='sm' variant='ghost' className='gap-1'>
								<PlusCircledIcon className='h-3.5 w-3.5' />
								Add Variant
							</Button>
						</CardFooter>
					</Card> */}

					{/* <Card x-chunk='dashboard-07-chunk-2'>
						<CardHeader>
							<CardTitle>Product Category</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid gap-6 sm:grid-cols-3'>
								<div className='grid gap-3'>
									<Label htmlFor='category'>Category</Label>

									<Select defaultValue={product.category?.toString()}>
										<SelectTrigger id='category' aria-label='Select category'>
											<SelectValue placeholder='Select category' />
										</SelectTrigger>

										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id.toString()} value={category.id.toString()}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className='grid gap-3'>
									<Label htmlFor='subcategory'>Subcategory (optional)</Label>
									<Select>
										<SelectTrigger id='subcategory' aria-label='Select subcategory'>
											<SelectValue placeholder='Select subcategory' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='t-shirts'>T-Shirts</SelectItem>
											<SelectItem value='hoodies'>Hoodies</SelectItem>
											<SelectItem value='sweatshirts'>Sweatshirts</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card> */}
				</div>

				<div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
					{/* <Card x-chunk='dashboard-07-chunk-3'>
						<CardHeader>
							<CardTitle>Product Status</CardTitle>
						</CardHeader>

						<CardContent>
							<div className='grid gap-6'>
								<div className='grid gap-3'>
									<Label htmlFor='status'>Status</Label>

									<Select>
										<SelectTrigger id='status' aria-label='Select status'>
											<SelectValue placeholder='Select status' />
										</SelectTrigger>

										<SelectContent>
											<SelectItem value='draft'>Draft</SelectItem>

											<SelectItem value='published'>Active</SelectItem>

											<SelectItem value='archived'>Archived</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</CardContent>
					</Card> */}

					<Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
						<CardHeader>
							<CardTitle>Vendor Details</CardTitle>
							{/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
						</CardHeader>
						<CardContent>
							<div className='grid gap-2'>More to come!</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className='flex items-center justify-center gap-2 md:hidden'>
				<Button variant='outline' size='sm'>
					Discard
				</Button>
				<Button size='sm'>Save Product</Button>
			</div>
		</main>
	);
}
