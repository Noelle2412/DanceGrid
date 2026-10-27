import ResponseError from "../utils/ResponseError.js";

function errorHandler(error, request, response, next) {
  if (error instanceof ResponseError) {
    response.status(error.statusCode).json({
      message: error.message,
    });
  } else {
    response.status(500).json({
      message: error.message,
    });
  }
  next();
}
export default errorHandler;
