import jwt from "jsonwebtoken";

import asyncHandler from "express-async-handler";

export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          mes: "Invalid access token",
        });
        
      }
      console.log(decode);
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).send({
      success: false,
      mes: "Require authentication!",
    });
  }
});
