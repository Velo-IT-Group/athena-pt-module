import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { getOrganization, getProposals } from '@/lib/functions/read';
import { Button } from '@/components/ui/button';
import { CalendarIcon, DotsHorizontalIcon, MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { relativeDate } from '@/utils/date';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCurrencyString } from '@/utils/money';
import { notFound } from 'next/navigation';
import OrganizationLayout from './organization-layout';
import { cookies } from 'next/headers';
import SortSelector from './sort-selector';
import Search from '@/components/Search';

export const HOME_SORT_COOKIE = 'homeSort';

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

const OverviewPage = async ({ params, searchParams }: Props) => {
	const cookieStore = cookies();
	const searchText = typeof searchParams.search === 'string' ? String(searchParams.search) : undefined;
	const homeSort = cookieStore.get(HOME_SORT_COOKIE);
	const proposals = await getProposals(homeSort?.value as keyof Proposal, searchText);

	if (!proposals) {
		notFound();
	}

	if (!proposals) return <div></div>;

	return (
		<OrganizationLayout org={params.org}>
			<div className='grow px-6 py-4 w-full space-y-4 flex flex-col'>
				<form method='GET' className='flex gap-4 items-center w-full'>
					<Search baseUrl={`/${params.org}`} placeholder='Search quotes' />
					<SortSelector defaultValue={homeSort?.value} />
					<Button asChild>
						<Link href={`/${params.org}/proposal/new`}>
							<PlusIcon className='w-4 h-4 mr-2' /> Add New
						</Link>
					</Button>
				</form>

				<div className='grid gap-4' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
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
