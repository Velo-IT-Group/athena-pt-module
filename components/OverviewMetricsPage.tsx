import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DotsHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ResponsiveBarChart from '@/components/ResponsiveBarChart';
import DatePickerWithRange from '@/components/DatePickerWithRange';

const data = [
	{
		goal: 400,
	},
	{
		goal: 300,
	},
	{
		goal: 200,
	},
	{
		goal: 300,
	},
	{
		goal: 200,
	},
	{
		goal: 278,
	},
	{
		goal: 189,
	},
	{
		goal: 239,
	},
	{
		goal: 300,
	},
	{
		goal: 200,
	},
	{
		goal: 278,
	},
	{
		goal: 189,
	},
	{
		goal: 349,
	},
];

const OverviewMetricsPage = async () => {
	return (
		<div className='container py-12 space-y-8'>
			<header className='flex items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-semibold tracking-tight'>Overview</h1>
					<h2 className='text-muted-foreground'>Last 14 days</h2>
				</div>
				<div className='flex items-center gap-4'>
					<DatePickerWithRange />
					<Button>
						<PlusIcon className='h-4 w-4 mr-2' /> Add New
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' size='icon'>
								<DotsHorizontalIcon className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Billing</DropdownMenuItem>
							<DropdownMenuItem>Team</DropdownMenuItem>
							<DropdownMenuItem>Subscription</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>

			<div className='grid grid-cols-5 gap-2'>
				<Card>
					<CardHeader>
						<CardTitle>Kubernetes costs</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='min-h-24'>
							<p className='text-2xl font-semibold'>$101.99</p>
						</div>
					</CardContent>
					<CardFooter>
						<p className='text-sm text-muted-foreground'>Including 1 cluster</p>
					</CardFooter>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Kubernetes costs</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='min-h-24'>
							<p className='text-2xl font-semibold'>$101.99</p>
						</div>
					</CardContent>
					<CardFooter>
						<p className='text-sm text-muted-foreground'>Including 1 cluster</p>
					</CardFooter>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Kubernetes costs</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='min-h-24'>
							<p className='text-2xl font-semibold'>$101.99</p>
						</div>
					</CardContent>
					<CardFooter>
						<p className='text-sm text-muted-foreground'>Including 1 cluster</p>
					</CardFooter>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Kubernetes costs</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='min-h-24'>
							<p className='text-2xl font-semibold'>$101.99</p>
						</div>
					</CardContent>
					<CardFooter>
						<p className='text-sm text-muted-foreground'>Including 1 cluster</p>
					</CardFooter>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Kubernetes costs</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='min-h-24'>
							<p className='text-2xl font-semibold'>$101.99</p>
						</div>
					</CardContent>
					<CardFooter>
						<p className='text-sm text-muted-foreground'>Including 1 cluster</p>
					</CardFooter>
				</Card>
			</div>

			<h3 className='text-2xl font-semibold'>Clusters</h3>

			<div className='grid grid-cols-2 gap-4 h-full'>
				<Card>
					<CardHeader className='flex-row items-center justify-between gap-4 w-full border-b'>
						<CardTitle>Kubernetes costs</CardTitle>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline' size='icon'>
									<DotsHorizontalIcon className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Profile</DropdownMenuItem>
								<DropdownMenuItem>Billing</DropdownMenuItem>
								<DropdownMenuItem>Team</DropdownMenuItem>
								<DropdownMenuItem>Subscription</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</CardHeader>
					<CardContent>
						<div className='min-h-24'>
							<p className='text-2xl font-semibold'>$101.99</p>
						</div>
					</CardContent>
					<CardFooter>
						<p className='text-sm text-muted-foreground'>Including 1 cluster</p>
					</CardFooter>
				</Card>
				<Card>
					<CardHeader className='flex-row items-center justify-between gap-4 w-full border-b'>
						<CardTitle>Kubernetes costs</CardTitle>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline' size='icon'>
									<DotsHorizontalIcon className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Profile</DropdownMenuItem>
								<DropdownMenuItem>Billing</DropdownMenuItem>
								<DropdownMenuItem>Team</DropdownMenuItem>
								<DropdownMenuItem>Subscription</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</CardHeader>
					<CardContent>
						<div className='mt-3 h-[120px]'>
							<ResponsiveBarChart data={data} />
						</div>
					</CardContent>
					<CardFooter>
						<p className='text-sm text-muted-foreground'>Including 1 cluster</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default OverviewMetricsPage;
