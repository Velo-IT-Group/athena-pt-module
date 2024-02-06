import createSupabaseServerClient from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const supabase = await createSupabaseServerClient();
	const { searchParams } = new URL(req.url);
	const code = searchParams.get('code');

	if (code) {
		await supabase.auth.exchangeCodeForSession(code);
	}

	return NextResponse.redirect(new URL('/account', req.url));
}
