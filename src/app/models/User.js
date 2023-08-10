const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: String,
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    phone: {
      type: String,
      max: 12,
    },
    location: {
      type: String,
      max: 255,
    },
    gateway: {
      name: {
        type: String,
      },
      nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "NodesList" }],
    },
    connect: {
      type: Boolean,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    inbox: {
      type: Array,
    },
    usersManager: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserManager",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
