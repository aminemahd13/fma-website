import { NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from './app/i18n/settings'

acceptLanguage.languages(languages)

const PUBLIC_FILE = /\.(.*)$/

export const config = {
  // matcher: '/:lang*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)']
}

export function middleware(req: any) {
  
  let lang
  if (req.cookies.has(cookieName)) lang = acceptLanguage.get(req.cookies.get(cookieName).value)
  if (!lang) lang = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lang) lang = fallbackLng

  // assets in public folder
  if (    
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  // Redirect if lang in path is not supported
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lang}${req.nextUrl.pathname}`, req.url))
  }

  if (!req.headers.has('referer')) {
    const language = req.nextUrl.pathname.split('/')[1];
    const response = NextResponse.next();
    if (language !== lang) {
      response.cookies.set(cookieName, language);
    }
    return response
  }

  // if (req.headers.has('referer')) {
  //   const refererUrl = new URL(req.headers.get('referer'))
  //   const langInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
  //   const response = NextResponse.next()
  //   if (langInReferer) response.cookies.set(cookieName, langInReferer)
  //   return response
  // }

  return NextResponse.next()
}