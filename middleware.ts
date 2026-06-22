import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production" && process.env.DEV_FAKE_AUTH === "1") {
    return NextResponse.next({ request });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Protected routes: /app (siswa), /staf (tenaga akademik), /admin, /onboarding
  const isProtected = path.startsWith("/app") || path.startsWith("/staf") || path.startsWith("/admin") || path.startsWith("/onboarding");

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Role-based isolation: each portal is strictly separated
  if (user && (path.startsWith("/app") || path.startsWith("/staf") || path.startsWith("/admin"))) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const role = profile?.role ?? "siswa";

    const homeFor = (r: string) => r === "admin" ? "/admin" : r === "staf" ? "/staf" : "/app";

    if (path.startsWith("/admin") && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = homeFor(role);
      return NextResponse.redirect(url);
    }

    if (path.startsWith("/staf") && role !== "staf" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = homeFor(role);
      return NextResponse.redirect(url);
    }

    if (path.startsWith("/app") && (role === "staf" || role === "admin")) {
      const url = request.nextUrl.clone();
      url.pathname = homeFor(role);
      return NextResponse.redirect(url);
    }
  }

  if (isProtected) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
