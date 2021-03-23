// vérification des saisies utilisateur

exports.Validation = (req, res, next) => {
  var regex = new RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ,-.!?]*$");
  // exclut tous ce qui n'est pas alphanumérique sauf ., et -
  try {
    if (
      !regex.test(req.body.username) ||
      !regex.test(req.body.title) ||
      !regex.test(req.body.content)
    ) {
      throw "Veillez à n'utiliser que des chiffres, des lettres et les caractères , . -";
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({
      error:
        "Veillez à n'utiliser que des chiffres, des lettres et les caractères , . -",
    });
  }
};

exports.authValidation = (req, res, next) => {
  var regexMail = new RegExp("^[^@s]+@[^@s.]+.[^@.s]+$");
  try {
    if (!regexMail.test(req.body.email)) {
      throw "Veillez à utiliser une adresse email valide";
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({
      error: "Veillez à utiliser une adresse email valide",
    });
  }
};
