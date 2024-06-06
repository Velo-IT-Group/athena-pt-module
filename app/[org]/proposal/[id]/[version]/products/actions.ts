'use server';
import { cookies } from 'next/headers';
import { updateSection } from '@/lib/functions/update';

export const changeSectionCookie = (proposal: string, value: string) => cookies().set(`${proposal}:selected-section`, value);

export const updateSectionInfo = async (data: FormData) => {
	const id = data.get('id') as string;
	const name = data.get('name') as string;

	await updateSection({ id, name });
};
