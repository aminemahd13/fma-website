import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "@/lib/fonts";
import { Suspense } from "react";
import NavBar from "@/components/layout/navbar";
import { Toaster } from "@/components/shared/toaster";
import Footer from "@/components/layout/footer";
import RecoilContextProvider from "./recoilContextProvider";
import { DataLoader } from "@/components/layout/data-loader";
import { dir } from 'i18next'
import { languages } from '../i18n/settings'

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export const metadata = {
  title: "MFA",
  description: "",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { lang: string },
}) {
  return (
    <html lang={params?.lang} dir={dir(params?.lang)} >
      <body className={cx(sfPro.variable, inter.variable)}>
        <RecoilContextProvider>
          <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
          <DataLoader lang={params?.lang}/>
          <Suspense fallback="...">
            <NavBar lang={params?.lang}/>
          </Suspense>
          <main className="flex min-h-screen w-full flex-col items-center py-20">
            <Suspense fallback="...">
              {children}
            </Suspense>
            <Toaster />
          </main>
          <Suspense fallback="...">
            <Footer />
          </Suspense>
        </RecoilContextProvider>    
      </body>
    </html>
  );
}
