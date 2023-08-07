import { ErrorRequestHandler } from "express";
import config from "../config/index";
import { IGenericErrorMessage } from "../interfaces/error";
import handleValidationError from "../errors/handleValidationError";
import { Error } from "mongoose";
import ApiError from "../errors/ApiError";
import handleCastError from "../errors/castError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorMessage: IGenericErrorMessage[] = [];

  if (err?.name === "ValidatorError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  } else if (err instanceof ApiError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessage = err?.message
      ? [
          {
            path: "",
            message: err?.message,
          },
        ]
      : [];
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessage = err?.message
      ? [
          {
            path: "",
            message: err?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    stack: config.env !== "production" ? err?.stack : undefined,
  });
};
export default globalErrorHandler;
