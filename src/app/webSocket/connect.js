const messagingClient = require("../mqtt/mqtt");
const User = require("../models/User");

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active users in this object
const { WebSocket } = require("ws");
const sendEmail = require("../nodemailer");
const sendSMS = require("../smsTwilio");
const users = {};
// The current editor content is maintained here.
let editorContent = null;
// User activity history.
let userActivity = [];
const typesDef = {
  USER_EVENT: "userevent",
  PUBLISH: "publish",
  CONTENT_CHANGE: "contentchange",
  ID_USER: "iduser",
};
let canSend = true;
const resetSmsSent = () => {
  smsSent = false; // Đặt lại biến smsSent thành false sau 5 phút
};
async function sendEmailandSMStoUserifhasWarning(nodeWarning, user) {
  if (canSend) {
    const objEmail = {
      from: "FireStationPortal@FireStationPortal.com",
      to: [user.email],
      subject: "Cảnh báo cháy",
      text: `Cụ thể là phát hiện cháy tại "${nodeWarning.map(
        (node) => `${node.node_name}`
      )}"
       vào lúc ${new Date().toLocaleString("pt-BR")}`,
      html: "src/app/nodemailer/mailformat.hbs",
    };

    const objSMS = {
      body: `Cảnh báo phát hiện cháy tại "${nodeWarning.map(
        (node) => `${node.node_name}`
      )}" 
     vào lúc ${new Date().toLocaleString("pt-BR")}`,
      phone: user.phone,
    };
    user.inbox.push(`Cảnh báo phát hiện cháy tại "${nodeWarning.map(
      (node) => `${node.node_name}`
    )}" 
   vào lúc ${new Date().toLocaleString("pt-BR")}`);
    user.save();
    // Send Email
    // try {
    //   await sendEmail(objEmail);
    // } catch (err) {
    //   console.log(err);
    // }
    // // Send SMS
    // sendSMS(objSMS);
    // Đặt canSend thành false để chặn việc gửi tiếp theo
    canSend = false;
    // Lên lịch gửi tiếp theo sau 5 phút
    setTimeout(() => {
      canSend = true;
    }, 5 * 60 * 1000); // 5 phút (5 * 60 * 1000 milliseconds)
  }
}
function handleIfhasWarning(user, nodeList) {
  const nodeWarning = nodeList.filter((node) => node.warning);
  if (nodeWarning.length) {
    sendEmailandSMStoUserifhasWarning(nodeWarning, user);
  }
}
function broadcastMessagetoUser(
  station,
  nodeList,
  gateway,
  jsonString,
  senderUserId = ""
) {
  if (!senderUserId) {
    User.find()
      .populate("roles", "-__v")
      .populate("usersManager", "-__v")
      .then((users) => {
        users.forEach((user) => {
          if (user.roles[0].name === station) {
            if (user.usersManager.length) {
              const userIndex = user.usersManager[0].Users.findIndex(
                (user) => user.gateway === gateway
              );
              if (userIndex !== -1) {
                // Người dùng đã tồn tại, cập nhật thông tin người dùng
                nodeList.forEach((e) => {
                  const nodeFound = user.usersManager[0].Users[
                    userIndex
                  ].nodes.find((node) => node.node_name === e.node_name);

                  if (nodeFound) {
                    nodeFound.Fire_value.push(e.Fire_value);
                    nodeFound.Smoke_value.push(e.Smoke_value);
                    nodeFound.Gas_value.push(e.Gas_value);
                    nodeFound.warning = e.warning;
                  } else {
                    user.usersManager[0].Users[userIndex].nodes.push(e);
                  }
                });
              } else {
                // Người dùng không tồn tại, thêm người dùng mới vào cuối mảng
                user.usersManager[0].Users.push({
                  gateway: gateway,
                  nodes: nodeList,
                });
              }
              user.usersManager[0].save();
            }
            senderUserId = user.id;
            for (let userId in clients) {
              let client = clients[userId];
              if (client.readyState === WebSocket.OPEN) {
                // Kiểm tra xem người dùng trùng khớp với người gửi ban đầu không
                if (userId === senderUserId) {
                  client.send(jsonString);
                }
              }
            }
          } else if (
            user.roles[0].name !== "user" &&
            user.roles[0].name !== station
          ) {
            if (user.usersManager.length) {
              const userIndex = user.usersManager[0].Users.findIndex((user) => {
                return user.gateway === gateway;
              });
              if (userIndex !== -1) {
                // Người dùng đã tồn tại, xóa người dùng
                user.usersManager[0].Users.splice(userIndex, 1);
              }
              user.usersManager[0].save();
            }
          }
        });
      });
  } else {
    User.findById(senderUserId)
      .populate("roles", "-__v")
      .populate("gateway.nodes", "-__v")
      .then((user) => {
        if (!user) {
          console.log({ error: "Không tìm thấy user" });
        } else if (user.gateway.nodes.length === 0) {
          console.log("Không có nodes nào được liên kết với user");
        } else {
          handleIfhasWarning(user, nodeList);
          nodeList.forEach((e) => {
            const nodeFound = user.gateway.nodes[0].nodes.find(
              (node) => node.node_name === e.node_name
            );
            if (nodeFound) {
              nodeFound.Fire_value.push(e.Fire_value);
              nodeFound.Smoke_value.push(e.Smoke_value);
              nodeFound.Gas_value.push(e.Gas_value);
              nodeFound.warning = e.warning;
            } else {
              user.gateway.nodes[0].nodes.push(e);
            }
          });
        }

        return user.gateway.nodes[0].save();
      })
      .then(() => {
        console.log("Cập nhật thành công");
      })
      .catch((err) => {
        console.log(err);
      });
    for (let userId in clients) {
      let client = clients[userId];
      if (client.readyState === WebSocket.OPEN) {
        // Kiểm tra xem người dùng trùng khớp với người gửi ban đầu không
        if (userId === senderUserId) {
          client.send(jsonString);
        }
      }
    }
  }
}
function handleMessage(message, userId) {
  const dataFromClient = JSON.parse(message.toString());
  const json = { type: dataFromClient.type };
  if (dataFromClient.type === typesDef.USER_EVENT) {
    users[userId] = dataFromClient;
    userActivity.push(
      `${dataFromClient.username} joined to get attribute the document`
    );
  } else if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
    editorContent = dataFromClient.content;
  } else if (dataFromClient.type === typesDef.PUBLISH) {
    editorContent = { ...dataFromClient.content, userId };
    messagingClient.publish(
      "messages/84b00ee2-07d5-4859-8376-34035192c14d/subcribe",
      editorContent.toString()
    );
    json.status = "Gửi thành công";
  }
}
function handleDisconnect(userId) {
  console.log(`${userId} disconnected.`);
  const json = { type: typesDef.USER_EVENT };
  const username = users[userId]?.username || userId;
  userActivity.push(`${username} left the document`);
  json.data = { users, userActivity };
  delete clients[userId];
  delete users[userId];
  json.status = "Đã ngắt kết nối";
}
const WebSocketHandle = {
  broadcastMessagetoUser,
  handleMessage,
  handleDisconnect,
};

const connect = (wsServer) => {
  wsServer.on("connection", function (connection) {
    connection.on("message", (message) => {
      const data = JSON.parse(message);
      if (data.type === typesDef.ID_USER) {
        const userId = data.userId;
        if (!userId) {
          console.log("Invalid userID.");
          return;
        }
        console.log("Received a new connection with userId:", userId);
        // Store the new connection and handle messages
        clients[userId] = connection;
        console.log(`${userId} connected.`);

        connection.on("message", (message) =>
          WebSocketHandle.handleMessage(message, userId)
        );
        // User disconnected
        connection.on("close", () => WebSocketHandle.handleDisconnect(userId));
      }
    });
  });
};

module.exports = { WebSocketHandle, connect };
