import ResponseError from "../utils/ResponseError.js";
import { ChoreoModel } from "../models/ChoreoModel";
//Incomplete!!

export const getChoreoById = async (req, res, next) => {
  try {
    const choreo = await ChoreoModel.findById(req?.params?.id);
    if (!choreo) throw new ResponseError("Choreo does not exist", 404);
    res.status(200).json(choreo);
  } catch (error) {
    next(error);
  }
};

export const createChoreo = async (req, res, next) => {
  try {
    const { name, owner, gridSize, mode } = req.body;
    const newChoreo = await ChoreoModel.create({
      name,
      owner,
      gridSize,
      mode,
      dancers: [],
      pictures: [],
      sharedWith: [],
    });
    res.status(201).json(newChoreo);
  } catch (error) {
    next(error);
  }
};

export const updateChoreo = async (req, res, next) => {
  try {
    const { name, gridSize, mode } = req.body;
    if (!name && !gridSize && !mode)
      throw new ResponseError("Provide at least one argument to update", 403);
    const updatedChoreo = await ChoreoModel.FindByIdAndUpdate(req?.params?.id, {
      name,
      gridSize,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChoreo = async (req, res, next) => {
  try {
    const deletedChoreo = await ChoreoModel.findByIdAndDelete(req?.params?.id);
    if (!deletedChoreo) throw new ResponseError("Choreo not found", 404);
    res.status(204).json(deletedChoreo);
  } catch (error) {
    next(error);
  }
};

export const updateCouples = async (req, res, next) => {
  try {
    const couples = req.body({ couples });

    const updatedChoreo = await ChoreoModel.findByIdAndUpdate(req?.params?.id, {
      couples,
    });
    if (!updateChoreo) throw new ResponseError("Choreo not found", 404);
  } catch (error) {
    next(error);
  }
};

export const addPicture = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const updatePicture = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const removePicture = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const addSharedUser = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const removeSharedUser = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
