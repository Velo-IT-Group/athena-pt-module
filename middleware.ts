import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
	let res = NextResponse.next({
		request: {
			headers: req.headers,
		},
	});

	const supabase = createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			get(name: string) {
				return req.cookies.get(name)?.value;
			},
			set(name: string, value: string, options: CookieOptions) {
				req.cookies.set({
					name,
					value,
					...options,
				});
				res = NextResponse.next({
					request: {
						headers: req.headers,
					},
				});
				res.cookies.set({
					name,
					value,
					...options,
				});
			},
			remove(name: string, options: CookieOptions) {
				req.cookies.set({
					name,
					value: '',
					...options,
				});
				res = NextResponse.next({
					request: {
						headers: req.headers,
					},
				});
				res.cookies.set({
					name,
					value: '',
					...options,
				});
			},
		},
	});

	const { data } = await supabase.auth.getUser();

	// console.log(data);
	const { user } = data;

	// if user is signed in and the current path is / redirect the user to /account
	// if (user && req.nextUrl.pathname === '/') {
	// 	return NextResponse.redirect(new URL('/account', req.url));
	// }

	// // if user is not signed in and the current path is not / redirect the user to /
	// if (!user && req.nextUrl.pathname !== '/login') {
	// 	return NextResponse.redirect(new URL('/login', req.url));
	// }

	return res;
}

export const config = {
	matcher: ['/', '/account', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
