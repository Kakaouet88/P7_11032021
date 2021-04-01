// vérification des saisies utilisateur

exports.Validation = (req, res, next) => {
  var regex = new RegExp("[<>{}~*]");
  try {
    if (regex.test(req.body.title) || regex.test(req.body.content)) {
      throw "Veillez à n'utiliser que des chiffres, des lettres et les caractères (, . - ! ? () : ;)";
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

exports.authValidation = (req, res, next) => {
  var regex = new RegExp("[<>{}~*]");
  try {
    if (regex.test(req.body.username)) {
      throw "Veillez à n'utiliser que des chiffres, des lettres et les caractères (, . - ! ? () : ;)";
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};
