'use client';

import * as React from 'react';
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const labels = ['feature', 'bug', 'enhancement', 'documentation', 'design', 'question', 'maintenance'];

const ProposalPicker = ({ proposals }: { proposals: Proposal[] }) => {
	const [label, setLabel] = React.useState('feature');
	const [open, setOpen] = React.useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<Link href={`/proposal/7620abbd-109d-46c5-b15e-c50841598045`} className='flex gap-2 items-center'>
				<span className='text-sm font-medium'>New Office May 2022</span>
				<DropdownMenuTrigger asChild>
					<CaretSortIcon className='w-4 h-4' />
				</DropdownMenuTrigger>
			</Link>
			<DropdownMenuContent align='end' className='w-[200px]'>
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem>Assign to...</DropdownMenuItem>
					<DropdownMenuItem>Set due date...</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Apply label</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className='p-0'>
							<Command>
								<CommandInput placeholder='Filter label...' autoFocus={true} className='h-9' />
								<CommandList>
									<CommandEmpty>No label found.</CommandEmpty>
									<CommandGroup>
										{labels.map((label) => (
											<CommandItem
												key={label}
												value={label}
												onSelect={(value) => {
													setLabel(value);
													setOpen(false);
												}}
											>
												{label}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<DropdownMenuItem className='text-red-600'>
						Delete
						<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProposalPicker;
