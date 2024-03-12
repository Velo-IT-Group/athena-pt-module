import React, { useState } from 'react';
import { ChatBubbleIcon, CheckIcon, Pencil1Icon, PersonIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
	BtnBold,
	BtnBulletList,
	BtnItalic,
	BtnLink,
	BtnNumberedList,
	ContentEditableEvent,
	Editor,
	EditorProvider,
	Toolbar,
} from 'react-simple-wysiwyg';

const ExternalReview = ({ members }: { members: Profile[] }) => {
	const selectedMembers = new Set([]);
	const [html, setHtml] = useState('my <b>HTML</b>');

	function onChange(e: ContentEditableEvent) {
		setHtml(e.target?.value ?? '');
	}

	return (
		<form className='grow overflow-auto'>
			<div className='grid grid-cols-[16px_1fr] gap-4'>
				<Pencil1Icon />
				<Input />
				<PersonIcon />
				<Command>
					<CommandInput placeholder='Member' />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{members.map((option) => {
								const isSelected = selectedMembers.has(option);
								return (
									<CommandItem
										key={option.id}
										onSelect={() => {
											if (isSelected) {
												selectedMembers.delete(option);
											} else {
												selectedMembers.add(option);
											}
											const filterValues = Array.from(selectedMembers);
											// column?.setFilterValue(filterValues.length ? filterValues : undefined);
										}}
									>
										<div
											className={cn(
												'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
												isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
											)}
										>
											<CheckIcon className={cn('h-4 w-4')} />
										</div>
										{/* {option.icon && <option.icon className='mr-2 h-4 w-4 text-muted-foreground' />} */}
										<span>{option.full_name}</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
						{/* {selectedMembers.size > 0 && (
									<>
										<CommandSeparator />
										<CommandGroup>
											<CommandItem onSelect={() => column?.setFilterValue(undefined)} className='justify-center text-center'>
												Clear filters
											</CommandItem>
										</CommandGroup>
									</>
								)} */}
					</CommandList>
				</Command>
				<ChatBubbleIcon />
				<EditorProvider>
					<Editor containerProps={{ style: { resize: 'vertical' } }} className='text-sm' value={html} onChange={onChange}>
						<Toolbar className='bg-secondary/50'>
							<BtnBold />
							<BtnItalic />
							<BtnLink />
							<BtnBulletList />
							<BtnNumberedList />
						</Toolbar>
					</Editor>
				</EditorProvider>
			</div>
		</form>
	);
};

export default ExternalReview;
