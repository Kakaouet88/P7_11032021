const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
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
            userId: user.id,
            token: jwt.sign(
              { userId: user.id, isadmin: user.isadmin },
              process.env.TOKEN_KEY,
              {
                expiresIn: "2h",
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
  const newuser = { ...req.body };
  // vérifier que l'utilisateur qui initie la requête est bien le créateur de la sauce et donc dispose des droits pour la supprimer
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;
  if (req.body.userId === userId) {
    // modif objet
    User.update(
      { where: { id: req.params.id } },
      { ...newuser, id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Profil modifié !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(401).json({
      error: "Vous ne pouvez pas modifier un profil qui n'est pas le vôtre !",
    });
  }
};

exports.deleteUser = (req, res, next) => {
  User.findOne({
    where: { id: req.params.id },
    include: [Comment, Post],
  })
    .then((user) => {
      // vérifier que l'utilisateur qui initie la requête est bien le créateur et donc dispose des droits pour la supprimer
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
      const userId = decodedToken.userId;
      const isadmin = decodedToken.isadmin;
      if (user.id === userId || isadmin === true) {
        Comment.destroy({ where: { userId: user.id } })
          .then(() =>
            res
              .status(200)
              .json({ message: "Commentaires du profil supprimés !" })
          )
          .catch((error) => res.status(400).json({ error }));
        Post.destroy({ where: { userId: user.id } })
          .then(() =>
            res.status(200).json({ message: "Posts du profil supprimés !" })
          )
          .catch((error) => res.status(400).json({ error }));
        User.destroy({ where: { id: user.id } })
          .then(() => res.status(200).json({ message: "Profil supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({
          error: "Vous ne disposez pas des droits pour supprimer ce profil !",
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
