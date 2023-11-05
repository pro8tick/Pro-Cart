const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
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
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be atleast 6 characters"],
      select: false,
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
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    wishlist: [{ type: ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

//Encrypt pass before saving to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
