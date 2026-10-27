import ResponseError from "../utils/ResponseError.js";
import { UserModel } from "../models/User.js";
import { ChoreoModel } from "../models/Choreo.js";

//Incomplete!!
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
    if (!user) throw new ResponseError("User does not exist", 404);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { username } = req.body;
    const newUser = await UserModel.create({
      username,
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
  //Delete all the choreos the user owned
  res.status(204).json(deletedUser);
};

export const getUsersChoreos = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req?.params?.id);
    if (!user) throw new ResponseError("User does not exist", 404);
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
    const choreos = await ChoreoModel.find({
      sharedWith: user._id,
    });
    res.status(200).json(choreos);
  } catch (error) {
    next(error);
  }
};
