const {Sequelize, DataTypes} = require("sequelize");
const Comment = require("./comment");
const User = require("./user");

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
    host: 'localhost',
    dialect: 'mysql'
  });

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    comments: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
    }
});
Post.belongsTo(User);
Post.hasMany(Comment);
Post.sync();

module.exports = Post;