'use client';
import Tiptap from '@/components/tip-tap';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/utils/supabase/client';
import { Transaction } from '@tiptap/pm/state';
import { Editor } from '@tiptap/react';
import React from 'react';

type Props = { description?: string; version: string; proposal: string };

function DescriptionEditor({ description, version, proposal }: Props) {
	const supabase = createClient();
	const handleBlur = async ({
		editor,
		event,
		transaction,
	}: {
		editor: Editor;
		event: FocusEvent;
		transaction: Transaction;
	}) => {
		if (description === editor.getHTML()) return;

		const { error } = await supabase
			.from('proposal_settings')
			.update({
				description: editor.getHTML(),
			})
			.match({ version, proposal });

		if (error) {
			console.error(error);
		}
	};

	return (
		<Tiptap
			content={description}
			onBlur={handleBlur}
		/>
		// <Textarea
		// 	className='w-[568px]'
		// 	defaultValue={description ?? undefined}
		// 	placeholder='Add an intro to the client...'

		// />
	);
}

export default DescriptionEditor;
