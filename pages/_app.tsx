import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { Fraunces, Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import Layout from '../Components/Layout'
import { usePersona } from '../Components/persona'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', display: 'swap' })
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap', axes: ['SOFT', 'opsz'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export default function App({ Component, pageProps }: AppProps) {
  const persona = usePersona()

  // mirror on <html> so the page background / scrollbar match the persona too
  useEffect(() => {
    document.documentElement.dataset.persona = persona
  }, [persona])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div
        data-persona={persona}
        className={`${sans.variable} ${grotesk.variable} ${serif.variable} ${mono.variable} min-h-screen bg-bg font-sans text-ink`}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </ThemeProvider>
  )
}
