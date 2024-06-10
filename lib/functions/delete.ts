'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const deleteProposal = async (id: string) => {
	'use server';
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const { error } = await supabase.from('proposals').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

export const deleteProduct = async (id: string) => {
	'use server';
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const { error } = await supabase.from('products').delete().eq('unique_id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('products');
	revalidateTag('proposals');
	revalidateTag('sections');
};

export const deleteTicket = async (id: string) => {
	'use server';
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const { error } = await supabase.from('tickets').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
	revalidateTag('phases');
};

export const deletePhase = async (id: string) => {
	'use server';
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const { error } = await supabase.from('phases').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
	revalidateTag('phases');
};

export const deleteSection = async (id: string) => {
	'use server';
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const { error } = await supabase.from('sections').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('sections');
	revalidateTag('proposals');
};

export const deleteTask = async (id: string) => {
	'use server';
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const { error } = await supabase.from('tasks').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
	revalidateTag('phases');
};
