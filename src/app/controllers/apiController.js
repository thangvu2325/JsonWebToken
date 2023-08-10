const User = require("../models/User");
const Sensor = require("../models/Sensor");
const messagingClient = require("../mqtt/mqtt");
class apiControllers {
  publishUsertoDevice(req, res) {
    User.findById(req.query.id)
      .then((user) => {
        if (user) {
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
        }
      })
      .then(() => {
        return res.status(200).json({ status: "Gửi thành công!" });
      })
      .catch((error) => {
        return res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
      });
  }
  // addSmokeValueinArrayValue(req, res) {
  //   const data = { ...req.body };
  //   User.findById(req.query.id)
  //     .populate("roles", "-__v")
  //     .then((user) => {
  //       if (!user) {
  //         return res.status(404).json({ error: "Không tìm thấy user" });
  //       }
  //       if (user.sensors.length === 0) {
  //         return res
  //           .status(404)
  //           .json({ error: "Không có sensor nào được liên kết với user" });
  //       }
  //       user.sensors[0].smoke_value.push(data);
  //       return user.sensors[0].save();
  //     })
  //     .then(() => {
  //       res.status(200).send("Cập nhật thành công");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  //     });
  // }

  getNodesOfUser(req, res) {
    User.findById(req.query.id)
      .populate("roles", "-__v")
      .populate("gateway.nodes", "-__v")
      .then((user) => {
        if (user) {
          const data = user.gateway.nodes[0].nodes;
          return res.status(200).json({ data });
        }
      })
      .catch((error) => {
        return res.status(500).json({ error: "Internal Server Error" });
      });
  }
  getAllUserinUserManager(req, res) {
    User.findById(req.query.id)
      .populate("usersManager", "-__v")
      .then((user) => {
        if (user) {
          return res.status(200).json(user.usersManager[0].Users);
        }
      })
      .catch((error) => {
        return res.status(500).json({ error: "Internal Server Error" });
      });
  }
  getAllUserWarninginUserManager(req, res) {
    User.findById(req.query.id)
      .populate("usersManager", "-__v")
      .populate("gateway.nodes", "-__v")
      .then((user) => {
        if (user) {
          const userWarning = user.usersManager[0]?.Users.filter((user) => {
            let isWarning = false;
            user.nodes.forEach((e) => {
              if (e.warning === true) {
                isWarning = true;
              }
            });
            return isWarning;
          });
          return res.status(200).json(userWarning);
        }
      });
  }
  getLocationofAllUser(req, res) {
    User.find()
      .populate("roles", "-__v")
      .populate("usersManager", "-__v")
      .populate("gateway.nodes", "-__v")
      .then((users) => {
        const data = {
          users: [],
          fireStation: [],
        };
        users.forEach((user) => {
          if (user.roles[0].name === "user") {
            const lat = user.location.split(",")[0];
            const lng = user.location.split(",")[1];
            data.users.push({
              location: {
                lat: lat,
                lng: lng,
              },
              email: user.email,
              phone: user.phone,
              gateway: user.gateway.name,
              userId: user.id,
            });
          } else {
            const lat = user.location.split(",")[0];
            const lng = user.location.split(",")[1];
            data.fireStation.push({
              location: {
                lat: lat,
                lng: lng,
              },
              userId: user.id,
            });
          }
        });
        console.log(data);
        return res.status(200).json(data);
      })
      .catch((error) => {
        return res.status(500).json({ error: error });
      });
  }
  getInbox(req, res) {
    User.findById(req.query.id)
      .then((user) => {
        if (user) {
          return res.status(200).json(user.inbox.reverse());
        }
      })
      .catch((error) => {
        return res.status(500).json({ error: "Internal Server Error" });
      });
  }
}

module.exports = new apiControllers();
