/* eslint-env node */
import {
  Tilt_Warp,
} from "next/font/google"
import Image from 'next/image'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import 'nextra-theme-docs/style.css'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './globals.css'

const tilt_wrap = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  metadataBase: new URL('https://rybbit.io'),
  title: {
    template: '%s - Rybbit'
  },
  description: 'Rybbit - open source web analytics',
  applicationName: 'Rybbit',
  generator: 'Next.js',
  appleWebApp: {
    title: 'Rybbit'
  },
  other: {
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'msapplication-TileColor': '#fff'
  },
  twitter: {
    site: 'https://rybbit.io'
  }
}

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <div className={`text-2xl flex items-center gap-1.5 ${tilt_wrap.className}`}>
          <Image src="/rybbit.png" alt="Rybbit" width={30} height={30} />
          rybbit.
        </div>
      }
      chatLink="https://discord.gg/DEhGb4hYBj"
      projectLink="https://github.com/goldflag/rybbit"

    />
  )
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          // banner={<Banner storageKey="Rybbit">Rybbit Alpha</Banner>}
          navbar={navbar}
          footer={<Footer>Copyright {new Date().getFullYear()} © Rybbit.</Footer>}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/goldflag/rybbit/blob/main/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
