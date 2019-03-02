import express from "express";
import path from "path";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import bodyParser from "body-parser";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import cors from "cors";
import jwt from "jsonwebtoken";

//import sequelize from "sequelize";
import models from "./models/index";
import { refreshTokens } from "./auth";
//secret value
const SECRET = "shfdjhjhdsfhy98ndnfshfosdfsfsiodfj";
const SECRET2 = "shfdjhjhfgdfgfddsfhy98ndnfshfosdfsfsiodfj";

//select all the files form a dir
//merge all schema
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));

//select all the files form a dir
//merge resolvers
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  //this a string
  resolvers
  //this is an object
});

// Initialize the app
const app = express();

//allowing all websites to access this server
app.use(cors("http://localhost:3000"));

const graphQLEndpoint = "/graphql";
// The GraphQL endpoint

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: graphQLEndpoint }));

//middleware for token
const addUser = async (req, res, next) => {
  //check any token available a token is a user
  const token = req.headers["x-token"];
  //if there
  if (token) {
    try {
      //verify the user with the secret code
      const { user } = jwt.verify(token, SECRET);
      //then get the user id
      req.user = user;
      //if an error found
    } catch (err) {
      //if the token expired use the refresh token
      const refreshToken = req.headers["x-refresh-token"];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET, //reqular token
        SECRET2 //this token for refresh the token
      );
      //cheking the token is good
      if (newTokens.token && newTokens.refreshToken) {
        //to set the new token as header and save that into the local storage
        res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
        res.set("x-token", newTokens.token);
        res.set("x-refresh-token", newTokens.refreshToken);
      }
      req.user = newTokens.user; //setting the new token to the expired token
    }
  }
  next();
};
app.use(addUser);

app.use(
  graphQLEndpoint,
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user, //the user id which comes from the token pass here as the requested user
      SECRET,
      SECRET2
    }
  }))
);

models.sequelize
  .sync(/*{ force: true } drops the data create from the begining*/)
  .then(() => {
    // Start the server
    app.listen(3001, () => {
      console.log("Go to http://localhost:3001/graphiql to run queries!");
    });
  });
