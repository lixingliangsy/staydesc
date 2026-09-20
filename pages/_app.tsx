import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import ChatWidget from '../components/ChatWidget'
import { SUPPORT } from '../lib/support.config'

export default function App({ Component, pageProps }: AppProps) {
  return       <><Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="StayDesc" />
        <meta property="og:description" content="Turn your space and amenities into a guest-ready listing: a hook, the experience, friendly house rules, and an invite to book." />
        <meta property="og:url" content="https://staydesc.lxsaihub.com/" />
        <meta property="og:image" content="https://staydesc.lxsaihub.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="StayDesc" />
        <meta name="twitter:description" content="Turn your space and amenities into a guest-ready listing: a hook, the experience, friendly house rules, and an invite to book." />
        <meta name="twitter:image" content="https://staydesc.lxsaihub.com/og.png" />
                                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"StayDesc","url":"https://staydesc.lxsaihub.com/","description":"Turn your space and amenities into a guest-ready listing: a hook, the experience, friendly house rules, and an invite to book.","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","priceCurrency":"USD","price":"0","availability":"https://schema.org/OnlineOnly"}}' }} />
      </Head>
      <Component {...pageProps} />
      <ChatWidget productName={SUPPORT.productName} brandColor={SUPPORT.brandColor} sessionKeyPrefix={SUPPORT.productSlug} /></>
}
