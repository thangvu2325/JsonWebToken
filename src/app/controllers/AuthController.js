const User = require("../models/User");
const Role = require("../models/Role");
const UserManager = require("../models/UserManager");
const Sensor = require("../models/Sensor");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const messagingClient = require("../mqtt/mqtt");
const { env } = require("process");
const NodesList = require("../models/NodesList");

let refreshTokens = [];

class AuthController {
  register(req, res) {
    res.render("register");
  }
  login(req, res) {
    res.render("login");
  }
  handleLogin(req, res) {
    User.findOne({ email: req.body.email })
      .populate("roles", "-__v")
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }

        const accessToken = jwt.sign(
          { id: user.id },
          env.AccessToken_SECRET_KEY,
          {
            expiresIn: "3600s",
          }
        );
        const refreshToken = jwt.sign(
          { id: user.id },
          env.RefreshToken_SECRET_KEY,
          {
            expiresIn: "30d",
          }
        );
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const _doc = {
          _id: user._id,
          email: user.email
            ? user.email.replace(user.email.split("@")[0].slice(-3), "***")
            : "",
          phone: user.phone
            ? user.phone.replace(user.phone.slice(-3), "***")
            : "",
          location: user.location ? user.location : "",
          gateway: user.gateway.name ? user.gateway.name : "",
          roles: user.roles ? user.roles : "",
        };
        return res.status(200).json({ _doc, accessToken });
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  }
  async signup(req, res) {
    const salt = await bcrypt.genSalt(10);
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
      phone: req.body.phone,
      location: req.body.location,
    });
    user
      .save()
      .then((user) => {
        if (req.body.roles) {
          return Role.find({
            name: { $in: req.body.roles },
          }).then((roles) => {
            const manager = new UserManager({ name: req.body.roles });
            manager.save();
            user.usersManager = { _id: manager.id };
            user.roles = roles.map((role) => role._id);
            return user.save();
          });
        } else {
          return Role.findOne({ name: "user" }).then((role) => {
            user.roles = [role._id];
            return user.save();
          });
        }
      })
      .then((user) => {
        const nodesList = new NodesList();
        nodesList.save();
        user.gateway.name = req.body.gateway;
        user.gateway.nodes = { _id: nodesList.id };
        return user.save();
      })
      .then(() => {
        const Lattitude = user.location.split(",")[0];
        const Longitude = user.location.split(",")[1];
        const jsonString = JSON.stringify({
          [user.gateway.name]: {
            Lattitude: Number(Lattitude),
            Longitude: Number(Longitude),
          },
        });
        messagingClient.publish(
          `messages/dc9d5717-2522-4f39-a899-cce286152284/${user.gateway.name}`,
          jsonString
        );
        res.send({ message: "User was registered successfully!" });
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  }
  refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json("You're not authenticated");
    }

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh Token is not valid");
    }

    jwt.verify(refreshToken, env.RefreshToken_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Refresh Token verification failed");
      }

      // Xoá refreshToken cũ khỏi danh sách
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // Tạo mã thông báo mới
      const newAccessToken = jwt.sign(
        { id: user.id },
        env.AccessToken_SECRET_KEY,
        { expiresIn: "3600s" }
      );
      // const newRefreshToken = jwt.sign(
      //   { id: user.id },
      //   env.RefreshToken_SECRET_KEY,
      //   { expiresIn: "30d" }
      // );

      // // Thêm refreshToken mới vào danh sách
      // refreshTokens.push(newRefreshToken);

      // // Gửi refreshToken mới về trình duyệt
      // res.cookie("refreshToken", newRefreshToken, {
      //   httpOnly: true,
      //   secure: false,
      //   path: "/",
      //   sameSite: "strict",
      // });

      // Trả về accessToken mới
      return res.status(200).json({ accessToken: newAccessToken });
    });
  }

  //LOG OUT
  logOut(req, res) {
    const refreshToken = req.cookies.refreshToken;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully!" });
  }
}

module.exports = new AuthController();
