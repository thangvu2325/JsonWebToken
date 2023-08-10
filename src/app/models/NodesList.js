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
const NodesList = new Schema(
  {
    nodes: [Node],
  },
  { timestamps: true }
);
module.exports = mongoose.model("NodesList", NodesList);
