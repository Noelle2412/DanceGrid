import ResponseError from "../utils/ResponseError.js";
import { ChoreoModel } from "../models/ChoreoModel";
import { ownerOfChoreo, canAccessChoreo } from "../utils/ChoreoPermissions.js";

export const getChoreoById = async (req, res, next) => {
  try {
    const choreo = await canAccessChoreo(req);
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
    const updatedChoreo = await canAccessChoreo(req);
    await updatedChoreo.updateOne({
      name,
      gridSize,
      mode,
    });
    res.status(200).json(updatedChoreo);
  } catch (error) {
    next(error);
  }
};

export const deleteChoreo = async (req, res, next) => {
  try {
    const deletedChoreo = await ownerOfChoreo(req);
    res.status(204).json(deletedChoreo);
  } catch (error) {
    next(error);
  }
};

export const updateCouples = async (req, res, next) => {
  try {
    const couples = req.body({ couples });
    const updatedChoreo = await canAccessChoreo(req);
    await updatedChoreo.updateOne({
      couples,
    });
    res.status(200).json(updatedChoreo);
  } catch (error) {
    next(error);
  }
};

export const updatePictures = async (req, res, next) => {
  try {
    const pictures = req.body({ pictures });
    const updatedChoreo = await canAccessChoreo(req);
    await updatedChoreo.updateOne({
      pictures,
    });
    res.status(200).json(updatedChoreo);
  } catch (error) {
    next(error);
  }
};

export const addSharedUser = async (req, res, next) => {
  try {
    const { id } = req.body({ sharedWithUser });
    const updatedChoreo = await ownerOfChoreo(req);
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
    const updatedChoreo = await ownerOfChoreo(req);
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

export const removeAccessToChoreo = async (req, res, next) => {
  try {
    const updatedChoreo = await canAccessChoreo(req);
    const index = updatedChoreo.sharedWith.indexOf(req.user.id);
    if (index === -1)
      throw new ResponseError("Choreo not shared with you", 403);
    updatedChoreo.sharedWith.splice(index, 1);
    await updatedChoreo.save();
    res.status(200).json(updatedChoreo);
  } catch (error) {
    next(error);
  }
};
