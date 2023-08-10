const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Sensor = new Schema(
  {
    smoke_value: {
      type: Array,
    },
    gas_value: {
      type: Array,
    },
    fire_value: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sensor", Sensor);
