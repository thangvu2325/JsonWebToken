const User = require("./app/models/User");
const UserManager = require("./app/models/UserManager");

const changeStreams = () => {
  UserManager.watch().on("change", async (data) => {
    // console.log(data.updateDescription.updatedFields);
    // const userWarning =
    //   data.updateDescription.updatedFields[
    //     Object.keys(data.updateDescription.updatedFields).filter(
    //       (item) => item !== "updatedAt"
    //     )
    //   ];
    // if (data.operationType === "update" && userWarning?.warning && !smsSent) {
    //   // Warning to Admin
    //   User.find()
    //     .populate("roles", "-__v")
    //     .then((users) => {
    //       users.forEach((user) => {
    //         if (user.roles.length && user.roles[0].name === userWarning.tram) {
    //           user.inbox.push(
    //             `Cảnh báo phát hiện cháy tại ${
    //               userWarning?.room || "Không xác định"
    //             } tại ${
    //               userWarning?.location || "không xác định"
    //             } vào lúc ${new Date().toLocaleString("pt-BR", {
    //               timeZone: "UTC",
    //             })}
    //                   `
    //           );
    //           user.save();
    //         }
    //       });
    //     });
    // Warning to User
    //     User.findOne({
    //       device: userWarning?.device,
    //     }).then((user) => {
    //       // Send SMS
    //       // Send Email
    //         .then(() => {
    //           console.log("Send Email thành công!");
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //       // push notify to user
    //       user.inbox.push(
    //         `Cảnh báo phát hiện cháy tại ${
    //           userWarning?.room || "Không xác định"
    //         } vào lúc ${new Date().toLocaleString("pt-BR")}`
    //       );
    //       return user.save();
    //     });
    //   }
  });
};
module.exports = changeStreams;
