import { TGenericErrorResponse } from "../interfaces/errorTypes";

export const handleCastError = (): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid MongoDB ObjectID. Please provide a valid id",
  };
};
