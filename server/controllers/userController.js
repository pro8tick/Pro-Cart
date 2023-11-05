const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const createSendToken = (user, res) => {
  const token = generateToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    // secure:true,
    // samesite:none,
  });
  user.password = undefined;
  res.status(201).json({
    status: "Success",
    token,
    data: {
      user,
    },
  });
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  //Check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  //Create new User
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    createSendToken(user, res);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add a email password");
  }

  //check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(400);
    throw new Error("Not a valid User");
  }
  const passWordIsCorrect = await bcrypt.compare(password, user.password);
  if (passWordIsCorrect) {
    createSendToken(user, res);
  } else {
    res.status(400);
    throw new Error("Not a valid Password");
  }
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    // secure:true,
    // samesite:none,
  });

  res.status(200).json({
    status: "Successfully logged Out",
    token: "",
  });
});

//Get User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

//Get login status

const getLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json(false);
  }

  //verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

//Update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const filteredBody = filterObj(req.body, "name", "phone", "address");
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not Found");
  }
});

const updatePhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;
  const user = await User.findById(req.user._id);
  user.photo = photo;
  const updatedUser = await user.save();
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const blockUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isBlocked: true,
  });

  res.status(201).json({
    status: "User blocked",
    data: {},
  });
});

const unblockUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isBlocked: false,
  });

  res.status(201).json({
    status: "User Unblocked",
    data: {},
  });
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  getLoginStatus,
  updateUser,
  updatePhoto,
  blockUser,
  unblockUser,
};
