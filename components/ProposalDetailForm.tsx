'use client';
import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { handleProposalUpdate } from '@/app/actions';

const frameworks = [
	{
		value: 'next.js',
		label: 'Next.js',
	},
	{
		value: 'sveltekit',
		label: 'SvelteKit',
	},
	{
		value: 'nuxt.js',
		label: 'Nuxt.js',
	},
	{
		value: 'remix',
		label: 'Remix',
	},
	{
		value: 'astro',
		label: 'Astro',
	},
];

const ProposalDetailForm = ({ proposal }: { proposal: Proposal }) => {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('');

	return (
		<form action={handleProposalUpdate} className='grid gap-4 py-4'>
			<div className='grid grid-cols-4 items-center gap-4'>
				<Label htmlFor='name' className='text-right'>
					Name
				</Label>
				<Input id='name' defaultValue={proposal.name} className='col-span-3' />
			</div>
			<div className='grid grid-cols-4 items-center gap-4'>
				<Label htmlFor='username' className='text-right'>
					Service Ticket
				</Label>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button variant='outline' role='combobox' aria-expanded={open} className='w-[200px] justify-between'>
							{value ? frameworks.find((framework) => framework.value === value)?.label : 'Select framework...'}
							<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-[200px] p-0'>
						<Command>
							<CommandInput placeholder='Search framework...' />
							<CommandEmpty>No framework found.</CommandEmpty>
							<CommandGroup>
								{frameworks.map((framework) => (
									<CommandItem
										key={framework.value}
										value={framework.value}
										onSelect={(currentValue) => {
											setValue(currentValue === value ? '' : currentValue);
											setOpen(false);
										}}
									>
										<CheckIcon className={cn('mr-2 h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')} />
										{framework.label}
									</CommandItem>
								))}
							</CommandGroup>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		</form>
	);
};

export default ProposalDetailForm;
