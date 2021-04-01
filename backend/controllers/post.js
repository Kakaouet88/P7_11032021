const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { Sequelize, DataTypes, Op, Model } = require("../middleware/sequelize");

exports.createPost = (req, res, next) => {
  const postObject = req.file
    ? {
        title: req.body.title,
        content: req.body.content,
        image: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  const newpost = Post.build({
    ...postObject,
    UserId: req.token.userId,
  });
  newpost
    .save()
    .then(() => res.status(201).json({ message: "Post créé !" }))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.getAllPosts = (req, res, next) => {
  Post.findAll({
    include: [Comment, User],
    order: [["updatedAt", "desc"]],
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id },
    include: [
      User,
      {
        model: Comment,
        include: User,
      },
    ],
    order: [[{ model: Comment }, "createdAt", "asc"]],
  })
    .then((post) => res.status(200).json(post))
    .catch((error) =>
      res.status(404).json({ error: "getOne error : " + error })
    );
};

exports.modifyPost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (post.UserId === req.token.userId) {
        // modif objet
        const postObject = req.file
          ? {
              ...req.body.post,
              image: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }
          : { ...req.body };
        if (req.file) {
          const filename = post.image.split("/images/")[1];
          fs.unlink(`./images/${filename}`, () => {
            Post.update(
              {
                ...postObject,
              },
              { where: { id: req.params.id } }
            )
              .then(() => res.status(200).json({ message: "Post modifié !" }))
              .catch((error) => res.status(400).json({ error }));
          });
        } else {
          Post.update(
            {
              ...postObject,
            },
            { where: { id: req.params.id } }
          )
            .then(() => res.status(200).json({ message: "Post modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        }
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
  })
    .then((post) => {
      // vérifier que l'utilisateur qui initie la requête est bien le créateur et donc dispose des droits pour la supprimer
      if (post.UserId == req.token.userId || req.token.isadmin === true) {
        if (post.image) {
          const filename = post.image.split("/images/")[1];
          fs.unlink(`./images/${filename}`, () => {
            Post.destroy({ where: { id: post.id } })
              .then(() => res.status(200).json({ message: "Post supprimé !" }))
              .catch((error) => res.status(400).json({ error }));
          });
        } else {
          Post.destroy({ where: { id: post.id } })
            .then(() => res.status(200).json({ message: "Post supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      } else {
        res.status(401).json({
          error: "Vous ne disposez pas des droits pour supprimer ce post !",
        });
      }
    })
    .catch((error) => res.status(500).json({ error: "delet err " + error }));
};

exports.deletePostComment = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id },
  })
    .then((post) => {
      // vérifier que l'utilisateur qui initie la requête est bien le créateur et donc dispose des droits pour la supprimer
      if (post.UserId === req.token.userId || req.token.isadmin === true) {
        Comment.findAll({
          where: { PostId: post.id },
        }).then((comment) => {
          if (!comment) {
            console.log("aucun com à supprimer");
            next();
          } else {
            Comment.destroy({ where: { PostId: post.id } });
            next();
          }
        });
      } else {
        res.status(401).json({
          error: "Vous ne disposez pas des droits pour supprimer ce Post !",
        });
      }
    })
    .catch((error) => res.status(500).json({ error: "deleteCom" + error }));
};

exports.commentPost = (req, res, next) => {
  const postId = req.params.id;

  if (req.body.content.length < 3) {
    res.status(400).json({ error: "message trop court" });
  } else {
    const newcom = Comment.build({
      PostId: postId,
      UserId: req.token.userId,
      content: req.body.content,
    });
    newcom
      .save()
      .then(() => res.status(201).json({ message: "Commentaire créé !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.deleteCom = (req, res, next) => {
  Comment.findOne({
    where: { id: req.params.id },
  })
    .then((com) => {
      // vérifier que l'utilisateur qui initie la requête est bien le créateur et donc dispose des droits pour la supprimer
      if (com.UserId == req.token.userId || req.token.isadmin === true) {
        Comment.destroy({ where: { id: com.id } })
          .then(() =>
            res.status(200).json({ message: "Commentaire supprimé !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({
          error:
            "Vous ne disposez pas des droits pour supprimer ce commentaire !",
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
