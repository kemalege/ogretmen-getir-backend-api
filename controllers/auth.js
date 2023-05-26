const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

// next içine error objesi yazıldığında errorhandlera gönderir ancak boşsa bir sonraki controllera gönderir.
const register = asyncErrorWrapper(async (req, res, next) => {
  const userInformation = req.body;

  const user = await User.create({
    ...userInformation,
  });
  sendJwtToClient(user, res);
});

const getUser = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  return res.status(200).json({
    success: true,
    data: user  
  });
});

const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validateUserInput(email, password)) {
    return next(new CustomError("Please Check your Inputs", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if(!user) {
    return next(new CustomError("Invalid email address or password", 400));
  }

  if (!comparePassword(password, user.password)) {
    return next(new CustomError("Please Check your credentials", 400));
  }

  sendJwtToClient(user, res);
});

const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;
  
  res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Logout Succesfull",
    });
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;

  const user = await User.findOne({ email: resetEmail });

  if (!user) {
    return next(new CustomError("There is no user with that email", 400));
  }
  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save();

  const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
  const emailTemplate = `
      <h3>Reset Your Password</h3>
      <p> This <a href = '${resetPasswordUrl}' target = '_blank'>link </a> will expire in 1 hour</p>
  `;

  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "Reset Your Password",
      html: emailTemplate,
    });
    return res.status(200).json({
      success: true,
      message: "Token sent to your Email",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new CustomError("Email Could Not Be Sent", 500));
  }
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const { password } = req.body;

  if (!resetPasswordToken) {
    return next(new CustomError("Please provide a valid token", 400));
  }
  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Invalid Token or Session Expired", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Your password has been reset",
  });
});

const editUser = asyncErrorWrapper(async (req, res, next) => {
  const editInformation = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: user,
  });
});

const createPhoto = asyncErrorWrapper(async (req, res, next) => {
  const result = req.data;
  
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profile_image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Image Upload Succesfull",
    data: {
      profile_image : user.profile_image.url
    }
  });
});

module.exports = {
  register,
  getUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  editUser,
  createPhoto,
};
