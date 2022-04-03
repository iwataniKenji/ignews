// AppProps -> propriedades que o componente pode receber
import { AppProps } from "next/app";
import { Header } from "../components/Header";
import { SessionProvider as NextAuthProvider } from "next-auth/react";

import "../styles/global.scss";

// App é carregado completamente toda vez que usuário troca de tela
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  );
}

export default MyApp;
