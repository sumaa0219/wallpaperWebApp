import { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>My Next.js App</title>
                <meta name="description" content="A Next.js application with seamless video playback" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
                <h1>My Video Playback App</h1>
            </header>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
