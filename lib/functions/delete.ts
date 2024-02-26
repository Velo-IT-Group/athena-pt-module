'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';

export const deleteProposal = async (id: string) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('proposals').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
};

export const deleteProduct = async (id: string) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('products').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('products');
	revalidateTag('proposals');
};

export const deleteTicket = async (id: string) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('tickets').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
	revalidateTag('sections');
};

export const deletePhase = async (id: string) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('phases').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
	revalidateTag('sections');
};

export const deleteTask = async (id: string) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('tasks').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
	revalidateTag('sections');
};

export const deleteSection = async (id: string) => {
	'use server';
	const supabase = createClient();
	const { error } = await supabase.from('sections').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidateTag('proposals');
	revalidateTag('sections');
};
