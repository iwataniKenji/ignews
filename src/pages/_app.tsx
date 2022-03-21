import { AppProps } from "next/app";

// AppProps -> propriedades que o componente pode receber
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
