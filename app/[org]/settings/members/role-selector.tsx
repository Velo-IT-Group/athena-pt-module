'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, ChevronUpIcon } from '@radix-ui/react-icons';

const roles = ['admin', 'member', 'owner'];

const RoleSelector = ({ role }: { role?: string }) => {
	const [value, setValue] = React.useState(role ?? 'member');
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant='outline' role='combobox' aria-expanded={open} className='w-[200px] justify-between'>
					{value ? roles.find((role) => role === value) : 'Select role...'}
					<ChevronUpIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandInput placeholder='Search role...' />
					<CommandEmpty>No role found.</CommandEmpty>
					<CommandGroup>
						{roles.map((role) => (
							<CommandItem
								key={role}
								value={role}
								onSelect={(currentValue) => {
									setValue(currentValue === value ? '' : currentValue);
									setOpen(false);
								}}
							>
								<CheckIcon className={cn('mr-2 h-4 w-4', value === role ? 'opacity-100' : 'opacity-0')} />
								{role}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default RoleSelector;
