const ROLES = require("../models/Role");
const User = require("../models/User");;

generateRefreshToken(user){
  return jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: "365d" }
  );
}
const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;