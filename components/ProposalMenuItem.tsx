'use client';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuShortcut, ContextMenuTrigger } from '@/components/ui/context-menu';
import { handleProposalDelete } from '@/app/actions';

type Props = {
	proposal: Proposal;
};

let USDollar = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

const ProposalMenuItem = ({ proposal }: Props) => {
	return (
		<ContextMenu>
			<ContextMenuTrigger>
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
			</ContextMenuTrigger>
			<ContextMenuContent className='w-64'>
				<ContextMenuItem>Duplicate</ContextMenuItem>
				<ContextMenuItem inset onClick={() => handleProposalDelete(proposal.id)}>
					Delete <ContextMenuShortcut>⌘</ContextMenuShortcut>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default ProposalMenuItem;
