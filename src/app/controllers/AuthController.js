const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
let refreshTokens = [];
class AuthController {
    register(req,res){
        res.render('register')
    }
    login(req,res){
        res.render('login')
    }
    handleLogin(req, res) {
      User.findOne({ email: req.body.email })
        .populate("roles", "-__v")
        .then(user => {
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
    
          const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    
          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }
    
          const accessToken = jwt.sign({ id: user.id }, "test" , { expiresIn: "600s" });
          const refreshToken = jwt.sign({ id: user.id }, "test" , { expiresIn: "365d" });
          refreshTokens.push(accessToken);
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure:false,
            path: "/",
            sameSite: "strict",
          });
          const { password, ...props } = user;
          const _doc = {
            _id: user._id,
            email: user.email ? user.email.replace(user.email.split('@')[0].slice(-3),'***') : '' ,
            phone: user.phone ? user.phone.replace(user.phone.slice(-3),'***') : '',
            location: user.location ? user.location : '',
            inform: user.inform ? user.inform : '',
            roles: user.roles ?  user.roles: '',
          };
          res.status(200).json({_doc, accessToken, refreshToken });
          // res.status(200).json({ user});
       
        })
        .catch(err => {
          res.status(500).send({ message: err });
        });
    }
    async signup(req,res){
      const salt = await bcrypt.genSalt(10);
      const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        phone: req.body.phone,
        location: req.body.location,
        inform: req.body.inform,
      });
      user.save()
      .then(user => {
        if (req.body.roles) {
          return Role.find({
            name: { $in: req.body.roles }
          })
            .then(roles => {
              user.roles = roles.map(role => role._id);
              return user.save();
            })
        } else {
          return Role.findOne({ name: "user" })
            .then(role => {
              user.roles = [role._id];
              return user.save();
            })
        }
      })
      .then(() => {
        res.send({ message: "User was registered successfully!" });
      })
      .catch(err => {
        res.status(500).send({ message: err });
      });
    }
    test(req,res){
    User.findById(req.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." ,id: req.userId});
      }
      res.send(user)
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
    }
    generateAccessToken(user){
      return jwt.sign(
        {
          id: user.id,
          admin: user.admin,
        },
        'test',
        { expiresIn: "20s" }
      );
    }
    requestRefreshToken(req, res){
      //Take refresh token from user
      const refreshToken = req.cookies.refreshToken;
      //Send error if token is not valid
      if (!refreshToken) return res.status(401).json("You're not authenticated");
      if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid");
      }
      jwt.verify(refreshToken, 'test', (err, user) => {
        if (err) {
          console.log(err);
        }
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        //create new access token, refresh token and send to user
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure:false,
          path: "/",
          sameSite: "strict",
        });
        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      });
    }
  
    //LOG OUT
    logOut(req, res){
      //Clear cookies when user logs out
      refreshTokens = refreshTokens.filter((token) => token !== req.headers.token);
      res.clearCookie("refreshToken");
      res.status(200).json("Logged out successfully!");
    }


}

module.exports = new AuthController;