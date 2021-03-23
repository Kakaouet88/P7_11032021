const sequelize = require("../middleware/sequelize");
const { Sequelize, DataTypes, Op, Model } = require("sequelize");
const Comment = require("./comment");
const Post = require("./post");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isadmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = User;

User.hasMany(Comment);
User.hasMany(Post);

User.sync();
