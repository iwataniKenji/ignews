// AppProps -> propriedades que o componente pode receber
import { AppProps } from "next/app";

// App é carregado completamente toda vez que usuário troca de tela
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
