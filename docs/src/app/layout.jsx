/* eslint-env node */
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Image from 'next/image'
import 'nextra-theme-docs/style.css'
import './globals.css'
import {
  Tilt_Warp,
} from "next/font/google";

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
        <div className={`text-xl flex items-center gap-1.5 ${tilt_wrap.className}`}>
          <Image src="/rybbit.png" alt="Rybbit" width={22} height={22} />
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
          banner={<Banner storageKey="Rybbit">Rybbit Alpha</Banner>}
          navbar={navbar}
          footer={<Footer>Copyright {new Date().getFullYear()} © Rybbit.</Footer>}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/shuding/nextra/blob/main/examples/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
