//import _ from "lodash";
import formatErrors from "../formatErrors";
//import models from "../models/index";
//import { ValidationError } from "sequelize";
//error validator
//parameters err-any error models- an models (user, message,...)

import { tryLogin } from "../auth";

export default {
  Query: {
    getUser: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll()
  },
  Mutation: {
    //this going to return the trylogin from auth
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    //this returns a function not a object
    //models comes via context from index.js
    //async returns a promise
    register: async (parent, args, { models }) => {
      try {
        //await without blocking
        const user = await models.User.create(args);
        return {
          ok: true,
          user
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models)
        };
      }
    }
  }
};
