const mongoose = require("mongoose");
const { Schema } = mongoose;

const brandSchema = new Schema({
  label: { type: String, required: [true, "label is required"], unique: true },
  value: { type: String, required: [true, "value is required"], unique: true },
});

const virtual = brandSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
