import formatErrors from "../formatErrors";

export default {
  //the user is passed as context from index.js
  //here async method is used
  Mutation: {
    createTeam: async (parent, args, { models, user }) => {
      try {
        await models.Team.create({ ...args, owner: user.id });
        return {
          ok: true
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err)
        };
      }
    }
  }
};
