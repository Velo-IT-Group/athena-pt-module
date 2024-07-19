'use client';
import Tiptap from '@/components/tip-tap';
import { createClient } from '@/utils/supabase/client';
import { Transaction } from '@tiptap/pm/state';
import { Content, Editor } from '@tiptap/react';
import React, { FocusEvent } from 'react';

type Props = {
	content?: Content;
	version: string;
	proposal: string;
};

const AssumptionsEditor = ({ content, version, proposal }: Props) => {
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
		if (content === editor.getHTML()) return;

		const { data, error } = await supabase
			.from('proposal_settings')
			.upsert({
				assumptions: editor.getHTML(),
				version,
				proposal,
			})
			.select();

		if (error) {
			console.error(error);
		}

		console.log(data);
	};

	return (
		<Tiptap
			content={content}
			onBlur={handleBlur}
		/>
	);
};

export default AssumptionsEditor;
