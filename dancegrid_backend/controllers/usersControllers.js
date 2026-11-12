import ResponseError from "../utils/ResponseError.js";
import { UserModel } from "../models/User.js";
import { ChoreoModel } from "../models/Choreo.js";
import { register, login, logout } from "../config/auth.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const registerUser = register;

export const loginUser = login;

export const logoutUser = logout;

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req?.params?.id);
    if (!user) throw new ResponseError("User does not exist", 404);
    if (!req.user.id === req.params.id)
      throw new ResponseError("You are not authorized to this user", 403);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.id === req.params.id)
    throw new ResponseError("You are not authorized to this user", 403);
  const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
  //Delete all the choreos the user owned
  res.status(204).json(deletedUser);
};

export const getUsersChoreos = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req?.params?.id);
    if (!user) throw new ResponseError("User does not exist", 404);
    if (!req.user.id === req.params.id)
      throw new ResponseError("You are not authorized to this user", 403);
    const choreos = await ChoreoModel.find({ owner: user._id });
    res.status(200).json(choreos);
  } catch (error) {
    next(error);
  }
};

export const getSharedWithChoreos = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req?.params?.id);
    if (!user) throw new ResponseError("User does not exist", 404);
    if (!req.user.id === req.params.id)
      throw new ResponseError("You are not authorized to this user", 403);
    const choreos = await ChoreoModel.find({
      sharedWith: user._id,
    });
    res.status(200).json(choreos);
  } catch (error) {
    next(error);
  }
};
