import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
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
	});

	await supabase.auth.getUser();

	try {
		// This will refresh session if expired - required for Server Components
		// https://supabase.com/docs/guides/auth/server-side/nextjs
		const {
			data: { user },
		} = await supabase.auth.getUser();

		// if user is signed in and the current path is / redirect the user to /account
		if (user && request.nextUrl.pathname === '/') {
			return NextResponse.redirect(new URL(`/${'velo-it-group'}/`, request.url));
		}

		//
		if (user && request.nextUrl.pathname === '/login') {
			await supabase.auth.signOut();
			return response;
		}

		//
		if (!user && request.nextUrl.pathname === '/login') {
			return response;
		}

		if (!user && !request.nextUrl.pathname.includes('review')) {
			// if user is not signed in and the current path is not / redirect the user to /
			return NextResponse.redirect(new URL('/login', request.url));
		}

		return response;
	} catch (e) {
		// If you are here, a Supabase client could not be created!
		// This is likely because you have not set up environment variables.
		// Check out ${process.env.NEXT_PUBLIC_LOCAL_URL} for Next Steps.
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
		 * Feel free to modify this pattern to include more paths.
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
		'/',
		'/login',
		'/[org]/:path*',
	],
};
