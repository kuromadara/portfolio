import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Fragment } from 'react'

import Navigation from '../Components/Navigation'
import HeaderPage from '../Components/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
        <Navigation />
        <HeaderPage />
        <Component {...pageProps} />
    </Fragment>
  )
}

export default MyApp
