import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);

	// The `/auth/callback` route is required for the server-side auth flow implemented
	// by the SSR package. It exchanges an auth code for the user's session.
	// https://supabase.com/docs/guides/auth/server-side/nextjs
	const code = searchParams.get('code');
	// if "next" is in param, use it as the redirect URL
	const next = searchParams.get('next') ?? '/velo-it-group';

	if (code) {
		const supabase = createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			return NextResponse.redirect(`${origin}/login?error=${error}`);
		}
	}

	// URL to redirect to after sign in process completes
	return NextResponse.redirect(`${origin}${next}`);
}
export async function POST(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	console.log('STUFF RUNNING ON SERVER ROUTE');

	// The `/auth/callback` route is required for the server-side auth flow implemented
	// by the SSR package. It exchanges an auth code for the user's session.
	// https://supabase.com/docs/guides/auth/server-side/nextjs
	const code = searchParams.get('code');
	// if "next" is in param, use it as the redirect URL
	const next = searchParams.get('next') ?? '/velo-it-group';

	if (code) {
		const supabase = createClient();

		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			return NextResponse.redirect(`${origin}/login?error=${error}`);
		}
	}

	// URL to redirect to after sign in process completes
	return NextResponse.redirect(`${origin}${next}`);
}
