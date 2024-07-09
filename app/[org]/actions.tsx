'use server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const handleSignOut = async () => {
	try {
		const cookieStore = cookies();
		const supabase = createClient();
		const { error } = await supabase.auth.signOut();

		if (error) throw new Error("Can't sign out user...");

		return redirect('/login');
	} catch (e) {}
};
