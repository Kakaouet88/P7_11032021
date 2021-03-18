const sequelize = require("../middleware/sequelize");
const { Sequelize, DataTypes, Op, Model } = require("sequelize");

const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});


module.exports = Comment;

const Post = require("./post");
const User = require("./user");

Comment.belongsTo(User);
Comment.belongsTo(Post);

Comment.sync();