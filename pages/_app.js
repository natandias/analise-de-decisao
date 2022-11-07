import { TabelaProvider } from "../context/TabelaContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <TabelaProvider>
      <Component {...pageProps} />
    </TabelaProvider>
  );
}

export default MyApp;
