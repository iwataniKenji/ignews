// AppProps -> propriedades que o componente pode receber
import { AppProps } from "next/app";
import { Header } from '../components/Header';

import "../styles/global.scss";

// App é carregado completamente toda vez que usuário troca de tela
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
