const {Sequelize, DataTypes} = require("sequelize");
const Comment = require("./comment");
const Post = require("./post");

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
    host: 'localhost',
    dialect: 'mysql'
  });

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departement: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Groupomania Group"
    },
    isadmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
});
Post.hasMany(Comment, Post);
Post.sync();

module.exports = User;