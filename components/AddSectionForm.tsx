import { handleSectionInsert } from '@/app/actions';
import { v4 as uuid } from 'uuid';
import React from 'react';
import SubmitButton from './SubmitButton';
import { PlusIcon } from '@radix-ui/react-icons';

const AddSectionButton = ({ id, setItems }: { id: string; setItems: (section: Section) => void }) => {
	return (
		<form
			action={handleSectionInsert}
			onSubmit={(event) => {
				event.preventDefault();
				let newSection: Section = {
					id: uuid(),
					name: 'New Section',
					created_at: Date(),
					order: 0,
					proposal: id,
				};

				// @ts-ignore
				setItems([...items, newSection]);
			}}
			className='h-full border border-dotted flex flex-col justify-center items-center gap-4 rounded-xl'
		>
			<SubmitButton>
				<PlusIcon className='w-4 h-4 mr-2' /> Add Section
			</SubmitButton>
		</form>
	);
};

export default AddSectionButton;
