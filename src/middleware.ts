import {createServerClient, type CookieOptions} from "@supabase/ssr";
import {NextResponse, type NextRequest} from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({name, value, ...options});
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({name, value, ...options});
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({name, value: "", ...options});
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({name, value: "", ...options});
        },
      },
    },
  );

  const {
    data: {session},
  } = await supabase.auth.getSession();

  // Lógica de protección:
  // Si no hay sesión y el usuario intenta entrar a dashboard o profile...
  if (
    !session &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/profile"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si ya hay sesión y el usuario intenta ir al login...
  if (session && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login"],
};
