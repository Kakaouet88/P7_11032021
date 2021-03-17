const {Sequelize, DataTypes} = require("sequelize");
const Post = require("./post");
const User = require("./user");

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
    host: 'localhost',
    dialect: 'mysql'
  });

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});
Comment.belongsTo(Post, User);
Comment.sync();

module.exports = Comment;