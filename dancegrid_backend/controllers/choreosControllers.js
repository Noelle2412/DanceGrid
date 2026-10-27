import ResponseError from "../utils/ResponseError.js";
import { ChoreoModel } from "../models/ChoreoModel";

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
    const updatedChoreo = await ChoreoModel.findByIdAndUpdate(req?.params?.id, {
      name,
      gridSize,
    });
    res.status(200).json(updatedChoreo);
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
    res.status(200).json(updatedChoreo);
  } catch (error) {
    next(error);
  }
};

export const updatePictures = async (req, res, next) => {
  try {
    const pictures = req.body({ pictures });
    const updatedChoreo = await ChoreoModel.findByIdAndUpdate(req?.params?.id, {
      pictures,
    });
    if (!updateChoreo) throw new ResponseError("Choreo not found", 404);
    res.status(200).json(updatedChoreo);
  } catch (error) {
    next(error);
  }
};

export const addSharedUser = async (req, res, next) => {
  try {
    const { id } = req.body({ sharedWithUser });
    const updatedChoreo = await ChoreoModel.findById(req?.params?.id);
    if (!updateChoreo) throw new ResponseError("Choreo not found", 404);
    if (updatedChoreo.sharedWith.includes(id))
      throw new ResponseError("Choreo already shared with that user", 403);
    updatedChoreo.sharedWith.push(id);
    await updatedChoreo.save();
    res.status(200).json(updatedChoreo);
  } catch (error) {
    next(error);
  }
};

export const removeSharedUser = async (req, res, next) => {
  try {
    const { id } = req.body({ sharedWithUser });
    const updatedChoreo = await ChoreoModel.findById(req?.params?.id);
    if (!updateChoreo) throw new ResponseError("Choreo not found", 404);
    const index = updatedChoreo.sharedWith.indexOf(id);
    if (index === -1)
      throw new ResponseError("Choreo not shared with that user", 403);
    updatedChoreo.sharedWith.splice(index, 1);
    await updatedChoreo.save();
    res.status(200).json(updatedChoreo);
  } catch (error) {
    next(error);
  }
};
