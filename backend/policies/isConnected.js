const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, `${env.JWT_SALT}`);
    const userId = decodedToken.userId;
    const user = await User.findOne({ where: { id: userId } });
    if (!user.dataValues.accountDeleted) {
      res.locals.user = user.dataValues;
      next();
    } else {
      throw {
        status: 423,
        customMessage:
          "Ce compte a été supprimé. Veuillez contacter votre administrateur.",
      };
    }
  } catch (error) {
    console.log(error);
    if (error == "TokenExpiredError: jwt expired") {
      res
        .status(418)
        .json({
          customMessage:
            "Votre connexion a expiré. Veuillez vous authentifier à nouveau.",
        });
    } else {
      res.status(error.status).json({ customMessage: error.customMessage });
    }
  }
};
