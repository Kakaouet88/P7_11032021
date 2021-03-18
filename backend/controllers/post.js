const Post = require("../models/post.js");
const fs = require("fs");
const jwt = require("jsonwebtoken");

exports.createPost = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;

  const newpost = Post.build({
    ...req.body,
    UserId: userId,
  });
  newpost
    .save()
    .then(() => res.status(201).json({ message: "Post créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllPosts = (req, res, next) => {
  Post.findAll({
    include: [{ model: Comment, as: "comments" }],
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id },
    include: [{ model: Comment, as: "comments" }],
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifyPost = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;

  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (post.UserId === userId) {
        // modif objet
        Post.update(
          { where: { id: req.params.id } },
          {
            title: req.body.title,
            content: req.body.content,
            id: req.params.id,
            UserId: userId,
            comments: post.comments,
          }
        )
          .then(() => res.status(200).json({ message: "Post modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({
          error: "Vous ne disposez pas des droits pour modifier ce post !",
        });
      }
    })
    .catch((error) => res.status(404).json({ error: "Post introuvable !" }));
};

exports.deletePost = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id },
    include: Comment,
  })
    .then((post) => {
      // vérifier que l'utilisateur qui initie la requête est bien le créateur et donc dispose des droits pour la supprimer
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
      const userId = decodedToken.userId;
      const isadmin = decodedToken.isadmin;

      if (post.UserId == userId || isadmin === true) {
        Post.destroy({ where: { id: req.params.id } })
          .then(() => res.status(200).json({ message: "Post supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
        Comment.destroy({ where: { postId: req.params.id } })
          .then(() =>
            res
              .status(200)
              .json({ message: "Commentaires du post supprimés !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({
          error: "Vous ne disposez pas des droits pour supprimer ce post !",
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.commentPost = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;

  const postId = req.params.id;

  const newcom = Comment.build({
    PostId: postId,
    UserId: userId,
    content: req.body.content,
  });
  newcom
    .save()
    .then(() => res.status(200).json({ message: "Commentaire créé !" }))
    .catch((error) => res.status(400).json({ error }));
};
