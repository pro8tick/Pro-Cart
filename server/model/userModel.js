const mongoose = require("mongoose");
const { ObjectId, Mixed } = mongoose.Schema;
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      validate: [validator.isEmail, "{VALUE} is not a valid email"],
    },
    password: {
      type: Buffer,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be atleast 6 characters"],
    },
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "admin"],
    },
    photo: {
      type: String,
      default: "http://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone: {
      type: String,
      default: "+234",
    },
    address: {
      type: Object,
    },
    addresses: { type: [Mixed], default: [] },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    salt: Buffer,
    resetPasswordToken: { type: String, default: "" },
    wishlist: [{ type: ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

const virtualId = userSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
