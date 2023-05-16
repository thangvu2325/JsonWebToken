const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;


const User = new Schema({
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
    inform: {
      type: String,
      max: 255,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],

},
  { timestamps: true }
);

module.exports = mongoose.model('User',User)