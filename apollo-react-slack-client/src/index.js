import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import { setContext } from "apollo-link-context";
import { ApolloLink } from "apollo-link";

//semantic ui
//the link to semantic-ui css file in the parent client file
import "semantic-ui-css/semantic.min.css";

import registerServiceWorker from "./registerServiceWorker";
import Routes from "./routes/index";

const httpLink = new createHttpLink({
  uri: "http://localhost:3001/graphql"
});

//setting up an header so to ckeck the user via token
//it's an middleware from apollo client
//when a request or query or mutation send to server the server
//this header will be sent with the token
//will check who is the one making the request
const middlewareLink = setContext(() => ({
  headers: {
    "x-token": localStorage.getItem("token"),
    "x-refresh-token": localStorage.getItem("refreshToken")
  }
}));

//after request
//setting the header with refresh token or new newtoken
//after the newtoken is created
//saving the refresh token to the local storage
const afterwareLink = new ApolloLink((operation, forward) => {
  const { headers } = operation.getContext();

  if (headers) {
    const token = headers.get("x-token");
    const refreshToken = headers.get("x-refresh-token");

    if (token) {
      localStorage.setItem("token", token);
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  return forward(operation);
});

const link = afterwareLink.concat(middlewareLink.concat(httpLink));

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById("root"));
registerServiceWorker();
