
export const getCustomError = (errorMessage, statusCode, globalError) => {
  const customErrorMessage = "An error has occurred";
  const error = globalError || new Error(errorMessage ?? customErrorMessage);
  error.statusCode = globalError?.statusCode ?? statusCode ?? 500;
  return error;
};