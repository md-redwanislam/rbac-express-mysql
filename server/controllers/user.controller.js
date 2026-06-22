import * as UserServices from "../services/user.service.js";

const getAllUsers = async (req, res) => {
  const result = await UserServices.getAllUsers();

  res.status(200).send({
    success: true,
    data: result,
  });
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    const err = new Error("User ID is required");
    err.statusCode = 400;
    throw err;
  }

  const result = await UserServices.getUserById(id);

  res.status(200).send({
    success: true,
    data: result,
  });
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const err = new Error("Name, email, and password are required");
    err.statusCode = 400;
    throw err;
  }

  const result = await UserServices.createUser(name, email, password);

  res.status(201).send({
    success: true,
    message: "User created successfully",
    data: result,
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!id) {
    const err = new Error("User ID is required");
    err.statusCode = 400;
    throw err;
  }

  const result = await UserServices.updateUser(id, name, email);

  res.status(200).send({
    success: true,
    message: "User updated successfully",
    data: result,
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    const err = new Error("User ID is required");
    err.statusCode = 400;
    throw err;
  }

  const result = await UserServices.deleteUser(id);

  res.status(200).send({
    success: true,
    message: result.message,
  });
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
