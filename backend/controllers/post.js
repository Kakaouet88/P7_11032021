const Post = require("../models/post.js");
const fs = require("fs");
const jwt = require("jsonwebtoken");

exports.createPost = (req, res, next) => {
  const post = new Post({
    ...req.body
  });
  post
    .save()
    .then(() => res.status(201).json({ message: "Post créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllPosts = (req, res, next) => {
  Post.findAll({ 
    include: Comment
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifyPost = (req, res, next) => {
  const post = {...req.body};
  // vérifier que l'utilisateur qui initie la requête est bien le créateur de la sauce et donc dispose des droits pour la supprimer
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;
  if (req.body.userId === userId) {
    // modif objet
    Post.update(
      { _id: req.params.id },
      { ...post, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Post modifié !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res
      .status(401)
      .json({
        error: "Vous ne disposez pas des droits pour modifier ce post !",
      });
  }
};

exports.deletePost = (req, res, next) => {
  Post.findAll({ where: {postId: req.params.id} })
    .then((sauce) => {
      // vérifier que l'utilisateur qui initie la requête est bien le créateur de la sauce et donc dispose des droits pour la supprimer
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
      const userId = decodedToken.userId;
      if (sauce.userId === userId) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        res
          .status(401)
          .json({
            error:
              "Vous ne disposez pas des droits pour supprimer cette sauce !",
          });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.voteSauce = (req, res, next) => {
  var UID = req.body.userId;

  switch (req.body.like) {
    // like
    case 1:
      Sauce.updateOne(
        { _id: req.params.id },
        { $inc: { likes: 1 }, $push: { usersLiked: UID } }
      )
        .then(() => res.status(200).json({ message: "Sauce likée !" }))
        .catch((error) => res.status(400).json({ error }));
      break;
    // dislike
    case -1:
      Sauce.updateOne(
        { _id: req.params.id },
        { $inc: { dislikes: 1 }, $push: { usersDisliked: UID } }
      )
        .then(() => res.status(200).json({ message: "Sauce dislikée !" }))
        .catch((error) => res.status(400).json({ error }));
      break;
    // retrait like ou dislike = if else
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          var Liked = sauce.usersLiked;
          // si l'user a liké
          if (Liked.includes(UID)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: UID },
              }
            )
              .then(() => res.status(200).json({ message: "Like retiré !" }))
              .catch((error) => res.status(400).json({ error }));
          } else {
            // si l'user avait disliké, pas besoin de préciser car la requête ne s'effectue que si un des 2 cas était true donc si le if ne l'est pas, le else l'est forcément.
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: UID },
              }
            )
              .then(() => res.status(200).json({ message: "Dislike retiré !" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(400).json({ error }));
  }
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
