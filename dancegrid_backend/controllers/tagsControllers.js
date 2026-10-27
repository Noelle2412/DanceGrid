import ResponseError from "../utils/ResponseError.js";
import { TagModel } from "../models/Tag.js";
import { TodoModel } from "../models/Todo.js";

export const getAllTags = async (req, res, next) => {
  try {
    const tags = await TagModel.find();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

export const getTagById = async (req, res, next) => {
  try {
    const tag = await TagModel.findById(req?.params?.id);
    if (!tag) {
      throw new ResponseError("Tag not found", 404);
    }
    res.status(200).json(tag);
  } catch (error) {
    next(error);
  }
};

export const getTodosByTag = async (req, res, next) => {
  try {
    const todos = await TodoModel.find({
      tags: req.params.id,
    });
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    const tag = await TagModel.create({ name });
    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    const tag = await TagModel.findByIdAndDelete(req?.params?.id);
    if (!tag) {
      throw new ResponseError("Tag not found", 404);
    }
    res.status(204).json(tag);
  } catch (error) {
    next(error);
  }
};
