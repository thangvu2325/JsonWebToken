const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Node = new mongoose.Schema({
  node_name: {
    type: String,
  },
  Fire_value: {
    type: Array,
  },
  Smoke_value: {
    type: Array,
  },
  Gas_value: {
    type: Array,
  },
  warning: {
    type: Boolean,
  },
});
const userSchema = new mongoose.Schema({
  gateway: {
    type: String,
  },
  nodes: [Node],
});
const UserManager = new Schema(
  {
    name: {
      type: String,
    },
    Users: [userSchema],
  },
  { timestamps: true }
);
module.exports = mongoose.model("UserManager", UserManager);
