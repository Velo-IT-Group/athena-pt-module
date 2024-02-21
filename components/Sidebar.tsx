import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { CheckIcon, ClockIcon, MixerHorizontalIcon, PlusIcon, StackIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProposalMenuItem from './ProposalMenuItem';
import { getProposals } from '@/lib/data';

type Status = {
	name: string;
	icon: React.ReactNode;
	color: string;
};

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

const Sidebar = async () => {
	const proposals = await getProposals();

	return (
		<aside className='col-span-2 pb-12 h-full'>
			<div className='mx-4 space-y-4 mb-4'>
				<div className='flex items-center gap-4 mt-4 justify-between'>
					<h2 className='text-lg font-semibold tracking-tight'>Proposals</h2>
					<Link href='/proposal/new'>
						<Button variant='link' size='icon'>
							<PlusIcon className='h-4 w-4' />
						</Button>
					</Link>
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
				<div className='h-full flex flex-col'>
					{proposals?.map((proposal) => (
						<ProposalMenuItem key={proposal.id} proposal={proposal} />
					))}
				</div>
			</ScrollArea>
		</aside>
	);
};

export default Sidebar;
