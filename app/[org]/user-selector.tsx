'use client';
import * as React from 'react';
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { updateMyProposalsCookie } from '@/lib/functions/update';
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
	defaultValue?: string[];
	users: Member[];
};

const UserSelector = ({ defaultValue, users }: Props) => {
	const [pending, startTransition] = React.useTransition();
	const [selectedValues, setSelectedValues] = React.useState(new Set(defaultValue));

	const addItem = (foo: string) => {
		// @ts-expect-error
		setSelectedValues((previousState) => new Set([...previousState, foo]));
	};

	const removeItem = (foo: string) => {
		// @ts-expect-error
		setSelectedValues((prev) => new Set([...prev].filter((x) => x !== foo)));
	};

	React.useEffect(() => {
		const filterValues = Array.from(selectedValues);
		updateMyProposalsCookie(filterValues);
	}, [selectedValues]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='outline' className='flex font-normal'>
					Select Users
					<CaretSortIcon className='h-4 w-4 opacity-50' />
					{selectedValues?.size > 0 && (
						<>
							<Separator orientation='vertical' className='mx-2 h-4' />
							<Badge variant='secondary' className='rounded-sm px-1 font-normal lg:hidden'>
								{selectedValues.size}
							</Badge>
							<div className='hidden space-x-1 lg:flex'>
								{selectedValues.size > 2 ? (
									<Badge variant='secondary' className='rounded-sm px-1 font-normal'>
										{selectedValues.size} selected
									</Badge>
								) : (
									users
										.filter((option) => selectedValues.has(option.id))
										.map((option) => (
											<Badge variant='secondary' key={option.id} className='rounded-sm px-1 font-normal'>
												{option.first_name} {option.last_name}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0' align='start'>
				<Command>
					<CommandInput placeholder='Select User' />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{users.map((option) => {
								const isSelected = selectedValues.has(option.id);
								return (
									<CommandItem
										key={option.id}
										onSelect={() => {
											if (isSelected) {
												removeItem(option.id);
											} else {
												addItem(option.id);
											}
										}}
										className='w-48 px-3'
									>
										<Checkbox defaultChecked={isSelected} className='mr-2' />

										<span>
											{option.first_name} {option.last_name}
										</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem onSelect={() => setSelectedValues(() => new Set([]))} className='justify-center text-center'>
										Clear filters
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default UserSelector;
