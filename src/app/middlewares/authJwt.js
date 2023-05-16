const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const Role =  require("../models/Role.js");
verifyToken = (req, res, next) => {
  const token =  req.cookies.refreshToken; // Lấy giá trị header từ yêu cầu HTTP
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, 'test', (err, decoded) => {
    if (err) {
      return res.status(401).send({ 
        message: "Unauthorized!",
        error: err,
     });
    }
    req.userId = decoded.id;
    next();
  });
};
// const verifyToken = (req, res, next) => {
//   //ACCESS TOKEN FROM HEADER, REFRESH TOKEN FROM COOKIE
//   const token = req.headers.token;
//   res.send(token)
//   const refreshToken = req.cookies.refreshToken;
//   if (token) {
//     const accessToken = token.split(" ")[1];
//     jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
//       if (err) {
//         res.status(403).json("Token is not valid!");
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.status(401).json("You're not authenticated");
//   }
// };


const authJwt = {
  verifyToken,
};
module.exports = authJwt;