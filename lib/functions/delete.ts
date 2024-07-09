'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const deleteProposal = async (id: string) => {
	const cookieStore = cookies();
	const supabase = createClient();
	const { error } = await supabase.from('proposals').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidatePath('/');
};

export const deleteProduct = async (id: string) => {
	const cookieStore = cookies();
	const supabase = createClient();
	const { error } = await supabase.from('products').delete().eq('unique_id', id);

	if (error) {
		console.error(error);
		throw error;
	}

	revalidatePath('/');
};

export const deleteTicket = async (id: string) => {
	const cookieStore = cookies();
	const supabase = createClient();
	const { error } = await supabase.from('tickets').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidatePath('/');
};

export const deletePhase = async (id: string) => {
	const cookieStore = cookies();
	const supabase = createClient();
	const { error } = await supabase.from('phases').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidatePath('/');
};

export const deleteSection = async (id: string) => {
	const cookieStore = cookies();
	const supabase = createClient();
	const { error } = await supabase.from('sections').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidatePath('/');
};

export const deleteTask = async (id: string) => {
	const cookieStore = cookies();
	const supabase = createClient();
	const { error } = await supabase.from('tasks').delete().eq('id', id);

	if (error) {
		console.error(error);
		return;
	}

	revalidatePath('/');
};
