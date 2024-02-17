import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleProposalUpdate } from '@/app/actions';
import TicketSelector from './TicketSelector';

const ProposalDetailForm = ({ proposal }: { proposal: Proposal }) => {
	return (
		<form action={handleProposalUpdate} className='grid gap-4 py-4'>
			<input defaultValue={proposal.id} name='id' hidden className='hidden' />
			<input defaultValue={proposal.sales_hours} name='sales_hours' hidden className='hidden' />
			{/* <input defaultValue={proposal.labor_rate} name='labor_rate' hidden className='hidden' /> */}
			<input defaultValue={proposal.management_hours} name='management_hours' hidden className='hidden' />
			<div className='grid grid-cols-4 items-center gap-4'>
				<Label htmlFor='name' className='text-right'>
					Name
				</Label>
				<Input id='name' defaultValue={proposal.name} className='col-span-3' />
			</div>
			<div className='grid grid-cols-4 items-center gap-4'>
				<Label htmlFor='labor_rate' className='text-right'>
					Labor Rate
				</Label>
				<Input name='labor_rate' defaultValue={proposal.labor_rate} type='number' className='col-span-3' />
			</div>
			<div className='grid grid-cols-4 items-center gap-4'>
				<Label htmlFor='username' className='text-right'>
					Service Ticket
				</Label>
				<TicketSelector />
				{/* <Popover open={open} onOpenChange={setOpen}>
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
				</Popover> */}
			</div>
			<input type='submit' hidden className='hidden' />
		</form>
	);
};

export default ProposalDetailForm;
