// vérification des saisies utilisateur

exports.Validation = (req, res, next) => {
  var regex = new RegExp(
    "^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ,-.!?():;\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]]*$"
  );

  // exclut tous ce qui n'est pas alphanumérique sauf ., et -
  try {
    if (
      !regex.test(req.body.username) ||
      !regex.test(req.body.title) ||
      !regex.test(req.body.content)
    ) {
      throw "Veillez à n'utiliser que des chiffres, des lettres et les caractères (, . -), les emojis sont autorisés pour le contenu";
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({
      error:
        "Veillez à n'utiliser que des chiffres, des lettres et les caractères (, . -), les emojis sont autorisés pour le contenu",
    });
  }
};

exports.authValidation = (req, res, next) => {
  var regexMail = new RegExp("^[^@s]+@[^@s.]+.[^@.s]+$");
  try {
    if (!regexMail.test(req.body.email)) {
      throw "Adresse email invalide";
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({
      error: "Veillez à utiliser une adresse email valide",
    });
  }
};
