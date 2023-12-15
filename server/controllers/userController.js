const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../model/userModel");
const { sanitizeUser } = require("../middleware/authMiddleware");

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
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    async function (err, hashedPassword) {
      const user = new User({ ...req.body, password: hashedPassword, salt });
      const doc = await user.save();

      req.login(sanitizeUser(doc), (err) => {
        // this also calls serializer and adds to session
        if (err) {
          res.status(400);
          throw new Error("Invalid user data");
        } else {
          const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET);
          res
            .cookie("jwt", token, {
              expires: new Date(Date.now() + 3600000),
              httpOnly: true,
            })
            .status(201)
            .json({ id: doc.id, role: doc.role });
        }
      });
    }
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role });
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
  if (req.user) {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      id: user.id,
      name: user.name,
      addresses: user.addresses,
      email: user.email,
      role: user.role,
      photo: user.photo,
    });
  } else {
    res.sendStatus(401);
  }
});

//Get login status

const getLoginStatus = (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

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
  const user = await User.findById(req.user.id);

  if (user) {
    const filteredBody = filterObj(
      req.body,
      "name",
      "phone",
      "address",
      "addresses"
    );
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
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
  const user = await User.findById(req.user.id);
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
