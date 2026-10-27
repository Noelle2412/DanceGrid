import ResponseError from "../utils/ResponseError.js";
import { UserModel } from "../models/User.js";
import { TodoModel } from "../models/Todo.js";

// Add more filters
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req?.params?.id);
    if (!user) {
      throw new ResponseError("User does not exist", 404);
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsersToDos = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req?.params?.id);
    if (!user) {
      throw new ResponseError("User does not exist", 404);
    }
    const todos = await TodoModel.find({ user: user._id }).populate({
      path: "user",
      select: "name",
    });
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    const newUser = await UserModel.create({
      name,
      email,
      age,
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { name, email, age } = req.body;
  if (!name && !email && !age) {
    throw new ResponseError("Provide at least one argument to update", 403);
  }
  const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
    name,
    email,
    age,
  });
  res.status(204).json(updatedUser);
};

export const deleteUser = async (req, res, next) => {
  const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
  res.status(204).json(deletedUser);
};
