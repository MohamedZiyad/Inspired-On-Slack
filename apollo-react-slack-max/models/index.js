import Sequelize from "sequelize";

const sequelize = new Sequelize("slack", "postgres", "admin", {
  dialect: "postgres",
  define: {
    underscored: true
  }
});

const models = {
  User: sequelize.import("./user"),
  //member: sequelize.import("./member"),
  Message: sequelize.import("./message"),
  Team: sequelize.import("./team"),
  Channel: sequelize.import("./channel")
};

//assotiations done by this
//a loop run through each model and creates the assotiation
Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = sequelize;

export default models;
