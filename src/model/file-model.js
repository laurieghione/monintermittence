var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var File = new Schema(
  {
    data: { type: String, required: true },
    name: { type: String },
    type: { type: String },
    declaration: { type: Schema.Types.ObjectId, ref: "Declaration" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("File", File);
