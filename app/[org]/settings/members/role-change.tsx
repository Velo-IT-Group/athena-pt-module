'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowRightIcon, ArrowTopRightIcon, CheckIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import RoleSelector from './role-selector';

const roles = ['admin', 'member', 'owner'];

const RoleChange = ({ role }: { role: string }) => {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [value, setValue] = React.useState(role);
	const [open, setOpen] = React.useState(role !== value);

	React.useEffect(() => {
		setDialogOpen(role !== value);
	}, [value, role]);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<RoleSelector role={role} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Change team member role</DialogTitle>
					<DialogDescription>Changing user&apos;s role changes their API token access.</DialogDescription>
				</DialogHeader>
				<div className='flex gap-2 items-center'>
					<div>
						<h3 className='font-medium'>Nick Black</h3>
						<div className='flex items-center gap-2 capitalize'>
							<span className='text-muted-foreground' style={{ textDecoration: 'line-through' }}>
								{role}
							</span>
							<ArrowRightIcon className='text-muted-foreground w-5 h-5' />
							<span className='text-primary font-medium'>{value}</span>
						</div>
					</div>
				</div>
				<p>
					Learn more about{' '}
					<Link href='/' className='flex-col text-primary font-light hover:underline'>
						Team Member Roles <ArrowTopRightIcon className='inline-block' />
					</Link>
				</p>
				<DialogFooter className='flex items-center w-full justify-between'>
					<DialogClose asChild>
						<Button variant='secondary' type='button'>
							Cancel
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button type='submit'>Confirm</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default RoleChange;
