import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { getOrganization, getProposals, getUser } from '@/lib/functions/read';
import { Button } from '@/components/ui/button';
import { CalendarIcon, DotsHorizontalIcon, MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { relativeDate } from '@/utils/date';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getCurrencyString } from '@/utils/money';
import { notFound } from 'next/navigation';
import OrganizationLayout from './organization-layout';

type Props = {
	params: { org: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	// fetch data
	const organization = await getOrganization();
	return {
		title: `Quotes - ${organization?.name ?? 'Unknown'}`,
	};
}

const OverviewPage = async ({ params }: Props) => {
	const user = await getUser();
	const proposals = await getProposals();
	if (!proposals || !user) {
		notFound();
	}

	if (!proposals) return <div></div>;

	return (
		<OrganizationLayout org={params.org}>
			<div className='container py-8 space-y-8'>
				<form method='GET' className='flex gap-4 items-center w-full'>
					<div
						className='flex h-9 items-center w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
						cmdk-input-wrapper=''
					>
						<MagnifyingGlassIcon className='mr-2 h-4 w-4 shrink-0 opacity-50' />
						<Input placeholder='Search quotes' className='border-0 shadow-none focus-visible:ring-0' />
					</div>

					<Select>
						<SelectTrigger className='w-48 bg-background'>
							<SelectValue placeholder='Sort by' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='activity'>Sort by activity</SelectItem>
							<SelectItem value='name'>Sort by name</SelectItem>
						</SelectContent>
					</Select>
					<Button asChild>
						<Link href={`/${params.org}/proposal/new`}>
							<PlusIcon className='w-4 h-4 mr-2' /> Add New
						</Link>
					</Button>
				</form>

				<div className='grid grid-cols-3 gap-4'>
					{proposals.map((proposal) => (
						<Card key={proposal.id} className='flex flex-col justify-stretch h-full'>
							<CardHeader className='flex-row items-start justify-between -space-y-2'>
								<div>
									<Link href={`${params.org}/proposal/${proposal.id}`}>
										<CardTitle className='text-sm hover:underline'>{proposal.name}</CardTitle>
									</Link>
									<Link href={`/review/${proposal.id}`}>
										<CardDescription className='line-clamp-1 hover:underline'>localhost:3000/review/{proposal.id}</CardDescription>
									</Link>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='ghost' size='sm'>
											<DotsHorizontalIcon className='w-4 h-4' />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem>Add To Favorites</DropdownMenuItem>
										<DropdownMenuItem>Settings</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem>Duplicate</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem className='text-red-600'>Delete</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</CardHeader>
							<CardContent className='grid grid-cols-2 gap-2'>
								<div className='grid w-full max-w-sm items-center gap-1.5'>
									<Label>Company</Label>
									<p className='text-sm text-muted-foreground'>{proposal?.company_name ?? 'Company Name'}</p>
								</div>
								<div className='grid w-full max-w-sm items-center gap-1.5'>
									<Label>Total</Label>
									<p className='text-sm text-muted-foreground'>{getCurrencyString(proposal.total_labor_price)}</p>
								</div>
							</CardContent>
							<CardFooter className='mt-auto'>
								<CalendarIcon className='h-3 w-3 mr-2' />
								<p className='text-sm text-muted-foreground'>{relativeDate(new Date(proposal.updated_at))}</p>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</OrganizationLayout>
	);
};

export default OverviewPage;
