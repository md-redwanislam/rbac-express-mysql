import * as AuthServices from "../services/auth.service.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const err = new Error("Please fill all details");
    err.statusCode = 400;
    throw err;
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
    const err = new Error("Please provide email and password");
    err.statusCode = 400;
    throw err;
  }
  const { user, token, refreshToken } = await AuthServices.login(
    email,
    password,
  );

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .send({
      success: true,
      data: {
        user,
        token,
      },
    });
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || "";

  if (!refreshToken) {
    const err = new Error("Refresh Token not found");
    err.statusCode = 404;
    throw err;
  }

  const { token, newRefreshToken } =
    await AuthServices.refreshToken(refreshToken);

  res
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .send({
      success: true,
      token: token,
    });
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export { login, logout, refreshToken, register };
