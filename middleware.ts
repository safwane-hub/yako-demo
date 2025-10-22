import { NextResponse } from "next/server";
export function middleware(req: Request) {
  const url = new URL(req.url);
  const { pathname } = url;
  const supported = ["en","fr","ar"];
  const isPrefixed = supported.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!isPrefixed && !pathname.startsWith("/_next") && !pathname.includes(".")) {
    return NextResponse.redirect(new URL(`/en${pathname}`, req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next|.*\..*).*)"] };
