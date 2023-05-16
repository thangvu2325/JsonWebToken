const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  // Lấy giá trị header từ yêu cầu HTTP
 if (token) {
  jwt.verify(token, 'test', (err, user) => {
    if (err) {
      res.status(403).json("Token is not valid!");
    }
    else{
      req.user = user;
      next();
    }
  });
} else {
  res.status(401).json("You're not authenticated");
}
}


const verifyTokenAndUserAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log(req.user.id === req.params.id)
    if (req.user.id === req.params.id|| req.user.roles.name == adminA || req.user.roles.name == adminB) {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndUserAuthorization,
  verifyTokenAndAdmin,
};