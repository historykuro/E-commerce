import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/jwt.js";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).send({ success: false, message: "Missing inputs" });
  }

  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User has existed!");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).send({
      success: newUser ? true : false,
      message: newUser
        ? "Register is successfully. Please go login~"
        : "Something went wrong",
    });
  }
});

// Refresh token => Cap moi accessToken
// Access Token => Confirm user and authoriazation

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ success: false, message: "Missing inputs" });
  }

  const response = await User.findOne({ email });

  if (response && (await response.isCorrectPassword(password))) {
    // Tach Password va role ra khoi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    // Create Access Token
    const accessToken = generateAccessToken(response._id, role);
    // Create Refresh Token
    const newRefreshToken = generateRefreshToken(response._id);
    // Save Refresh token to DB

    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // Save Refresh token to cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).send({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

// export const logout = asyncHandler(async (req, res) => {
//   const cookie = req.cookies;
//   if (!cookie || !cookie.refreshToken)
//     throw new Error("No refresh token in cookies");
//   await User.findOne(
//     { refreshToken: cookie.refreshToken },
//     { refreshToken: "" },
//     { new: true }
//   );

//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: true,
//   });
//   return res.status(200).send({
//     success: true,
//     mes: "Logout",
//   });
// });

export const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById({ _id }).select(
    "-refreshToken -password -role"
  );

  return res.status(200).send({
    success: false,
    result: user ? user : "User not found",
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  // take Token to from cookies
  const cookie = req.cookies;
  // check Token is available or not
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // check Token is valid or not
  jwt.verify(
    cookie.refreshToken,
    process.env.JWT_SECRET,
    async (err, decode) => {
      if (err) throw new Error("Invalid refresh token");
      // check if the new and old Tokens match or not
      const response = await User.findOne({
        _id: decode._id,
        refreshToken: cookie.refreshToken,
      });
      return res.status(200).send({
        success: response ? true : false,
        newAccessToken: response
          ? generateAccessToken(response._id, response.role)
          : "Refresh token not matched",
      });
    }
  );
});
