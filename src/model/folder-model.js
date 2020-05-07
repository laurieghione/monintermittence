const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Folder = new Schema(
  {
    name: { type: String, required: false },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: false },
    active: { type: Boolean, required: false },
    user: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("folder", Folder);
