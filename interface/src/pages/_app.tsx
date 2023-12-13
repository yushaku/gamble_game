import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import "../../styles/fonts.css";
import "../../styles/globals.css";
import MainLayout from "../components/layouts";
import store from "../reduxs/store";
import { theme } from "../utils/theme";

function MyApp({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any;

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="keywords" content="Flip, coin, deget" />
          <meta name="author" content="Flip Coin" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <MainLayout>
          <AnyComponent {...pageProps} />
        </MainLayout>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
