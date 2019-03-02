import bcrypt from "bcrypt";
export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          //squelize validation
          isAlphanumeric: {
            args: true,
            msg: "The username can only contaion letters and numbers"
          },
          len: {
            args: [3, 25],
            msg: "The username needs to be 3 and 25 charecters long"
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid email address"
          }
        }
      },
      //password validation hasing password
      password: {
        type: DataTypes.STRING,
        //validation method from squalize
        validate: {
          len: {
            args: [5, 100],
            msg: "The password needs to be between 5 and 100 charectors long"
          }
        }
      }
    },
    {
      hooks: {
        afterValidate: async user => {
          //bycrypt to hash the password
          //soltround 12 makeing it complex
          // const hashPassword = await bcrypt.hash(password, 12);
          const hashPassword = await bcrypt.hash(user.password, 12);
          user.password = hashPassword; //mutating the password
        }
      }
    }
  );

  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: "member",
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
    //M:M
    User.belongsToMany(models.Channel, {
      through: "channel_member",
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
  };
  return User;
};
