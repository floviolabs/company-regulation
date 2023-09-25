import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google';
import NextNProgress from 'nextjs-progressbar'

const poppins = Poppins({ weight:['400','500','700'], subsets: ['latin'] });
export default function App({ Component, pageProps }: AppProps) {
  
  return(
  <div className={poppins.className}>
    <NextNProgress />
    <Component {...pageProps} />
  </div>
  )
}
