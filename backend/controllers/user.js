const User = require("../models/user");
const Comment = require("../models/comment");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bouncer = require("express-bouncer")(120000, 1.8e6, 5);

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const newuser = User.build({
        email: req.body.email,
        username: req.body.username,
        password: hash,
      });
      newuser
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) =>
          res.status(401).json({ error: "Adresse email déjà utilisée !" })
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            username: user.username,
            userId: user.id,
            isadmin: user.isadmin,
            token: jwt.sign(
              { userId: user.id, isadmin: user.isadmin },
              process.env.TOKEN_KEY,
              {
                expiresIn: "24h",
              }
            ),
          });
          bouncer.reset(req);
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneUser = (req, res, next) => {
  User.findOne({
    where: { id: req.params.id },
    include: Post,
  })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifyUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const newuser = {
        username: req.body.username,
        email: req.body.email,
        password: hash,
      };
      // vérifier que l'utilisateur qui initie la requête est bien le créateur et donc dispose des droits pour la supprimer
      if (req.params.id === req.token.userId || req.token.isadmin === 1) {
        User.findOne({
          where: { id: req.params.id },
        }).then((user) => {
          bcrypt.compare(req.body.oldpassword, user.password).then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ error: "Ancien mot de passe incorrect" });
            } else {
              User.update(
                { ...newuser, id: req.params.id },
                { where: { id: req.params.id } }
              )
                .then(() =>
                  res.status(200).json({ message: "Profil modifié !" })
                )
                .catch((error) =>
                  res.status(400).json({ error: "update failed" + error })
                );
            }
          });
        });
      } else {
        res.status(401).json({
          error:
            "Vous ne pouvez pas modifier un profil qui n'est pas le vôtre !" +
            uid,
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteUser = (req, res, next) => {
  User.findOne({
    where: { id: req.params.id },
  })
    .then((user) => {
      // vérifier que l'utilisateur qui initie la requête est bien le créateur et donc dispose des droits pour la supprimer
      if (user.id === req.token.userId || req.token.isadmin === true) {
        User.destroy({ where: { id: user.id } })
          .then(() => res.status(200).json({ message: "Profil supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({
          error: "Vous ne disposez pas des droits pour supprimer ce profil !",
        });
      }
    })
    .catch((error) => res.status(500).json({ error: "deleteUser" + error }));
};

exports.deleteUserComment = (req, res, next) => {
  User.findOne({
    where: { id: req.params.id },
  })
    .then((user) => {
      // vérifier que l'utilisateur qui initie la requête est bien le créateur et donc dispose des droits pour la supprimer
      if (user.id === req.token.userId || req.token.isadmin === true) {
        Comment.findAll({
          where: { UserId: user.id },
        }).then((comment) => {
          if (!comment) {
            console.log("aucun com à supprimer");
            next();
          } else {
            Comment.destroy({ where: { userId: user.id } });
            next();
          }
        });
      } else {
        res.status(401).json({
          error: "Vous ne disposez pas des droits pour supprimer ce profil !",
        });
      }
    })
    .catch((error) => res.status(500).json({ error: "deleteCom" + error }));
};

exports.deleteUserPost = (req, res, next) => {
  User.findOne({
    where: { id: req.params.id },
  })
    .then((user) => {
      // vérifier que l'utilisateur qui initie la requête est bien le créateur et donc dispose des droits pour la supprimer
      // if (user.id === req.token.userId || req.token.isadmin === true) {

      Post.findAll({
        where: { UserId: user.id },
      }).then((post) => {
        if (!post) {
          console.log("aucun post à supprimer");
          next();
        } else {
          Post.destroy({ where: { userId: user.id } });
          next();
        }
      });

      //   else {
      //     res.status(401).json({
      //       error: "Vous ne disposez pas des droits pour supprimer ce profil !",
      //     });
      //   }
      // })
    })
    .catch((error) => res.status(500).json({ error: "deletePost" + error }));
};
