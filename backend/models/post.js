const sequelize = require("../middleware/sequelize");
const { Sequelize, DataTypes, Op, Model } = require("sequelize");

const Post = sequelize.define("Post", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Post;

const Comment = require("./comment");
const User = require("./user");

Post.belongsTo(User);
Post.hasMany(Comment);

Post.sync();
