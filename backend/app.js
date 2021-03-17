const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const path = require("path");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");

require("dotenv").config();

// connexion sequelize
const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate().then(() => {
  console.log('Connecté à la base de données MySQL !');
}).catch(err => {
  console.error('Connexion à la base de données échouée !', err);
}).finally(() => {
  console.log('Connexion terminée.');
  sequelize.close();
});
// sequelize fin

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/post", postRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
