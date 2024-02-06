import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { CheckIcon, ClockIcon, DotsVerticalIcon, MixerHorizontalIcon, PlusIcon, StackIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import NewProposalForm from './NewProposalForm';
import { ProjectTemplate } from '@/types';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Status = {
	name: string;
	icon: React.ReactNode;
	color: string;
};

let USDollar = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

const statuses: Array<Status> = [
	{
		name: 'All Proposals',
		icon: <StackIcon className='h-4 w-4' />,
		color: '',
	},
	{
		name: 'Approved',
		icon: <CheckIcon className='h-4 w-4' />,
		color: '#3B82B5',
	},
	{
		name: 'In Progress',
		icon: <ClockIcon className='h-4 w-4' />,
		color: '#50975A',
	},
];

type Props = {
	proposals: Array<Proposal> | null;
};

const Sidebar = async ({ proposals }: Props) => {
	const res = await fetch(`http://localhost:3000/api/templates`);
	const templates: Array<ProjectTemplate> = await res.json();

	return (
		<aside className='col-span-2 pb-12 border-r h-full'>
			<div className='mx-4 space-y-4 mb-4'>
				<div className='flex items-center gap-4 mt-4 justify-between'>
					<h2 className='text-lg font-semibold tracking-tight'>Proposals</h2>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant='secondary' size='icon'>
								<PlusIcon className='h-4 w-4' />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>New Proposal</DialogTitle>
								<DialogDescription>Make changes to your profile here. Click save when youre done.</DialogDescription>
							</DialogHeader>
							<NewProposalForm templates={templates} />
						</DialogContent>
					</Dialog>
				</div>

				<div className='flex items-center gap-4'>
					<Select>
						<SelectTrigger className='flex-1'>
							<SelectValue
								placeholder={
									<div className='flex items-center gap-4 flex-1'>
										<StackIcon className='h-4 w-4' />
										All Proposals
									</div>
								}
								className='justify-between'
							/>
						</SelectTrigger>
						<SelectContent>
							{statuses.map((status) => (
								<SelectItem key={status.name} value={status.name} className='flex items-center gap-4 flex-1'>
									{status.icon} <p>{status.name}</p>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button variant='secondary' size='icon'>
						<MixerHorizontalIcon className='h-4 w-4' />
					</Button>
				</div>
			</div>

			<Separator />

			<ScrollArea>
				<div className='flex flex-col'>
					{proposals?.map((proposal) => (
						<Link
							key={proposal.id}
							href={`/proposal/${proposal.id}`}
							className='flex flex-col items-start gap-4 p-4 text-left text-sm transition-all hover:bg-accent border-b active:bg-accent w-full'
						>
							<div className='w-full flex-1'>
								<Badge variant='secondary'>Badge</Badge>
								<DropdownMenu>
									<DropdownMenuTrigger asChild className='hidden hover:flex ml-auto'>
										<Button variant='ghost' size='icon'>
											<DotsVerticalIcon className='h-4 w-4' />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuGroup>
											<DropdownMenuItem>
												Duplicate
												<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
											</DropdownMenuItem>
											<DropdownMenuItem>
												Another Item
												<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
											</DropdownMenuItem>
											<DropdownMenuItem>
												Another Item
												<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
											</DropdownMenuItem>
											<DropdownMenuItem>
												Another Item
												<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
											</DropdownMenuItem>
										</DropdownMenuGroup>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											Delete
											<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							<div className='flex gap-4 justify-between w-full'>
								<p className='font-medium'>{proposal.name}</p>
								<p className='font-medium'>{USDollar.format(Number(proposal.total_labor_price))}</p>
							</div>
							<div className='flex items-center gap-4 w-full'>
								<p className='text-muted-foreground'>{proposal.id}</p>
								<Separator orientation='vertical' className='h-4' />
								<p className='text-muted-foreground'>02/10/1998</p>
							</div>
						</Link>
					))}
				</div>
			</ScrollArea>
		</aside>
	);
};

export default Sidebar;
