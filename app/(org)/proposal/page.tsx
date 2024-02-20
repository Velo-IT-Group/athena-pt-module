import React from 'react';
import { getProposals } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { CalendarIcon, DotsHorizontalIcon, DropdownMenuIcon, PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { relativeDate } from '@/utils/date';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VeloLogo from '@/components/VeloLogo';
import SlashIcon from '@/components/SlashIcon';
import { Label } from '@/components/ui/label';
import { getCurrencyString } from '@/utils/money';

const ProposalsPage = async () => {
	const proposals = await getProposals();

	if (!proposals) return <div></div>;

	return (
		<div className='flex flex-col h-full flex-1'>
			<header className='container flex items-center gap-4 w-full h-14'>
				<Link href='/proposal'>
					<VeloLogo classname='w-6 h-6' />
				</Link>

				<SlashIcon className='h-4 opacity-15' />

				<h1 className='font-semibold text-lg tracking-tight'>Proposals</h1>
			</header>

			<div className='bg-muted/50 flex-1'>
				<div className='container py-8 space-y-8'>
					<div className='flex gap-4 items-center'>
						<Input placeholder='Search quotes' className='bg-background' />
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
							<Link href='/proposal/new'>
								<PlusIcon className='w-4 h-4 mr-2' /> Add New
							</Link>
						</Button>
					</div>
					<div className='grid grid-cols-3 gap-4'>
						{proposals.map((proposal) => (
							<Link key={proposal.id} href={`/proposal/${proposal.id}`}>
								<Card>
									<CardHeader className='flex-row items-start justify-between -space-y-2'>
										<CardTitle>{proposal.name}</CardTitle>
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
									<CardFooter>
										<CalendarIcon className='h-3 w-3 mr-2' />
										<p className='text-sm text-muted-foreground'>{relativeDate(new Date(proposal.updated_at))}</p>
									</CardFooter>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProposalsPage;
