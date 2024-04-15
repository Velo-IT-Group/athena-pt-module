'use client';
import { Input } from '@/components/ui/input';
import { updateProposal } from '@/lib/functions/update';
import React from 'react';
import { toast } from 'sonner';

type Props = {
	defaultValue: number;
	proposalKey: keyof Proposal;
	id: string;
};

const BlurredInput = ({ defaultValue, proposalKey, id }: Props) => {
	return (
		<Input
			className='col-span-2'
			defaultValue={defaultValue}
			type='number'
			onBlur={async (e) => {
				const value = e.currentTarget.valueAsNumber;
				if (value !== defaultValue) {
					try {
						console.log(proposalKey, value);
						await updateProposal(id, { [proposalKey]: value });
						toast('Proposal updated!');
					} catch (error) {
						toast('Error updating proposal', { style: { color: 'red' } });
					}
				}
			}}
		/>
	);
};

export default BlurredInput;
