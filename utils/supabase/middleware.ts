import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	try {
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					get(name: string) {
						return request.cookies.get(name)?.value;
					},
					set(name: string, value: string, options: CookieOptions) {
						request.cookies.set({
							name,
							value,
							...options,
						});
						response = NextResponse.next({
							request: {
								headers: request.headers,
							},
						});
						response.cookies.set({
							name,
							value,
							...options,
						});
					},
					remove(name: string, options: CookieOptions) {
						request.cookies.set({
							name,
							value: '',
							...options,
						});
						response = NextResponse.next({
							request: {
								headers: request.headers,
							},
						});
						response.cookies.set({
							name,
							value: '',
							...options,
						});
					},
				},
			}
		);

		const { data, error } = await supabase.auth.getUser();

		if (error || !data.user) throw new Error('No user signed in...');

		// if user is signed in and the current path is / redirect the user to /account
		if (request.nextUrl.pathname === '/') {
			console.log('is on homepage');
			return NextResponse.redirect(new URL(`/velo-it-group`, request.url));
		}

		if (request.nextUrl.pathname === '/login') {
			console.log('is on login');
			return NextResponse.redirect(new URL(`/velo-it-group`, request.url));
		}
	} catch (e) {
		// if user is not signed in and the current path is not / redirect the user to /
		if (request.nextUrl.pathname.includes('review')) {
			return response;
		}

		if (request.nextUrl.pathname === '/login') {
			return response;
		}

		return NextResponse.redirect(new URL('/login', request.url));
	}

	return response;
}
