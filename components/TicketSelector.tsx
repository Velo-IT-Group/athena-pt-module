'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ProjectTemplateTicket } from '@/types/manage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getTickets } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const TicketSelector = ({ tickets }: { tickets?: ProjectTemplateTicket[] }) => {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('');
	// const [tickets, setTickets] = React.useState<ProjectTemplateTicket[]>([]);

	// React.useEffect(() => {
	// 	getTickets().then((data) => setTickets(data ?? []));
	// }, []);

	return (
		<Select name='service_ticket'>
			<SelectTrigger className='col-span-3'>
				<SelectValue placeholder='Select a ticket' />
			</SelectTrigger>
			<SelectContent>
				{tickets?.map((ticket) => (
					// @ts-ignore
					<SelectItem key={ticket.id} value={String(ticket.id)}>
						#{ticket.id} - {ticket.summary}
					</SelectItem>
					// <CommandItem
					// 	key={ticket.id}
					// 	value={String(ticket.id)}
					// 	onSelect={(currentValue) => {
					// 		setValue(currentValue === value ? '' : currentValue);
					// 		setOpen(false);
					// 	}}
					// >
					// 	{ticket.summary}

					// 	<CheckIcon className={cn('ml-auto h-4 w-4', value === ticket.summary ? 'opacity-100' : 'opacity-0')} />
					// </CommandItem>
				))}
			</SelectContent>
		</Select>
		// <Popover open={open} onOpenChange={setOpen}>
		// 	<PopoverTrigger asChild>
		// 		<Button variant='outline' role='combobox' aria-expanded={open} className='justify-between w-full col-span-3'>
		// 			{value ? tickets.find((ticket) => String(ticket.id) === value)?.summary : 'Select ticket...'}
		// 			<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
		// 		</Button>
		// 	</PopoverTrigger>
		// 	<PopoverContent className='p-0 '>
		// 		<Command>
		// 			<CommandInput placeholder='Search framework...' className='h-9' />
		// 			<CommandEmpty>No framework found.</CommandEmpty>
		// 			<CommandGroup>
		// 				{/* <ScrollArea className='h-60'> */}
		// 				{tickets.map((ticket) => (
		// 					<CommandItem
		// 						key={ticket.id}
		// 						value={String(ticket.id)}
		// 						onSelect={(currentValue) => {
		// 							setValue(currentValue === value ? '' : currentValue);
		// 							setOpen(false);
		// 						}}
		// 					>
		// 						{ticket.summary}

		// 						<CheckIcon className={cn('ml-auto h-4 w-4', value === ticket.summary ? 'opacity-100' : 'opacity-0')} />
		// 					</CommandItem>
		// 				))}
		// 				{/* </ScrollArea> */}
		// 			</CommandGroup>
		// 		</Command>
		// 	</PopoverContent>
		// </Popover>
	);
};

export default TicketSelector;
