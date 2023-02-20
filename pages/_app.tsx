import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import { mainTheme } from '@/customTheme'

import { Navbar } from '@/components/Navbar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={mainTheme}>
        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
