'use client';
import React from 'react';
import { Input } from './ui/input';
import { updateProposal } from '@/lib/functions/update';
import { toast } from 'sonner';

type Props = {
	title: string;
	id: string;
};

const NavbarTitleEditor = ({ title, id }: Props) => {
	return (
		<Input
			// className='max-w-[500px] truncate font-medium decoration-muted-foreground'
			className='border text-base border-transparent hover:border-border hover:cursor-default rounded-lg shadow-none px-2 -mx-2 py-2 -my-2 w-full truncate font-medium flex-1'
			defaultValue={title}
			onBlur={async (e) => {
				if (e.currentTarget.value !== title) {
					id && (await updateProposal(id, { name: e.currentTarget.value }));
					toast('Proposal updated!');
				}
			}}
		/>
	);
};

export default NavbarTitleEditor;
