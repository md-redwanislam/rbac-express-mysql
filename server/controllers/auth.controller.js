import * as AuthServices from "../services/auth.service.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all details",
    });
  }

  const result = await AuthServices.register(name, email, password);

  res.status(201).send({
    success: true,
    data: result,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }
  const result = await AuthServices.login(email, password);

  res.status(200).send({
    success: true,
    data: result,
  });
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body || "";

  if (!refreshToken) {
    return res.status(404).json({
      success: false,
      message: "Refresh Token not found",
    });
  }

  const result = await AuthServices.refreshToken(refreshToken);

  res.status(200).send({
    seuccess: true,
    data: result,
  });
};

const emailVerify = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide email.",
    });
  }

  const result = await AuthServices.emailVerify(email);

  res.status(200).send({
    success: true,
    result,
  });
};

const otpVerify = async (req, res) => {
  const email = req.query.email;
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Please provide OTP",
    });
  }

  const result = await AuthServices.otpVerify(email, code);

  res.status(200).send({
    success: true,
    result,
  });
};

const resetPassword = async (req, res) => {
  const email = req.query.email;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Please provide password",
    });
  }

  const result = await AuthServices.resetPassword(email, password);

  res.status(200).send({
    success: true,
    result,
  });
};

export { emailVerify, login, otpVerify, refreshToken, register, resetPassword };
