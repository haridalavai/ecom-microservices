import "bootstrap/dist/css/bootstrap.css";
import { ChakraProvider } from "@chakra-ui/react";
import { buildClient } from "../api/build-client";
import Header from "../components/header";
function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <ChakraProvider>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </ChakraProvider>
  );
}
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
    console.log(pageProps);
  }

  console.log(data);

  return {
    pageProps,
    ...data,
  };
};
export default AppComponent;
