const jwt = require("jsonwebtoken");
const { env } = require("process");
const User = require("../models/User");
const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    console.log(token);
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, env.AccessToken_SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not Valid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You're not authenticated");
    }
  },
  verifyTokenandManagerAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      console.log(req.user);
      User.findById(req.user.id)
        .populate("roles", "-__v")
        .then((user) => console.log(user));
      // if (req.user.id == req.params.id || req.user.admin) {
      next();
      // } else {
      //   res.status(403).json("You're not allowed to delete other");
      // }
    });
  },
};
module.exports = middlewareController;
