import ResponseError from "../utils/ResponseError.js";
import { TodoModel } from "../models/Todo.js";

// Add more filters
export const getAllTodos = async (req, res, next) => {
  try {
    if (req.query.isCompleted) {
      const todos = await TodoModel.find({
        isCompleted: req.query.isCompleted,
      })
        .populate({
          path: "user",
          select: "_id name",
        })
        .populate({
          path: "tags",
          select: "name",
        });
      res.status(200).json(todos);
    } else {
      const todos = await TodoModel.find()
        .populate({
          path: "user",
          select: "_id name",
        })
        .populate({
          path: "tags",
          select: "name",
        });
      res.status(200).json(todos);
    }
  } catch (error) {
    next(error);
  }
};

export const getTodoById = async (req, res, next) => {
  try {
    const todo = await TodoModel.findById(req?.params?.id)
      .populate({
        path: "user",
        select: "_id name",
      })
      .populate({
        path: "tags",
        select: "name",
      });
    if (!todo) {
      throw new ResponseError("To Do does not exist", 404);
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (req, res, next) => {
  try {
    const { title, priority, dueDate, description, isCompleted, user, tags } =
      req.body;
    const newTodo = await TodoModel.create({
      title,
      priority,
      dueDate,
      description,
      isCompleted,
      user,
      tags,
    });
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req, res, next) => {
  const { title, priority, dueDate, description, isCompleted, user, tags } =
    req.body;
  if (
    !title &&
    !priority &&
    !dueDate &&
    !description &&
    !isCompleted &&
    !user &&
    !tags
  ) {
    throw new ResponseError("Provide at least one argument to update", 403);
  }
  const updatedTodo = await TodoModel.findByIdAndUpdate(req.params.id, {
    title,
    priority,
    dueDate,
    description,
    isCompleted,
    user,
    tags,
  });
  res.status(204).json(updatedTodo);
};

export const addTag = async (req, res, next) => {
  try {
    const { tag } = req.body;
    const todo = await TodoModel.findByIdAndUpdate(
      req?.params?.id,
      {
        $push: { tags: [tag] },
      },
      { new: true },
    );
    if (!todo) {
      throw new ResponseError("To Do does not exist", 404);
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

export const removeTag = async (req, res, next) => {
  try {
    const { tag } = req.body;
    const todo = await TodoModel.findByIdAndUpdate(
      req?.params?.id,
      {
        $pop: { tags: [tag] },
      },
      { new: true },
    );
    if (!todo) {
      throw new ResponseError("To Do does not exist", 404);
    }
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  const deletedTodo = await TodoModel.findByIdAndDelete(req.params.id);
  if (!deletedTodo) {
    throw new ResponseError("Todo not found", 404);
  }
  res.status(204).json(deletedTodo);
};
