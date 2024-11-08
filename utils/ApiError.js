const ApiError = (statusCode, message = "Something went wrong", errors = [], stack = "") => {
    const errorObj = new Error(message);
    
    errorObj.statusCode = statusCode;
    errorObj.data = null;
    errorObj.message = message;
    errorObj.success = false;
    errorObj.errors = errors;
    
    if (stack) {
      errorObj.stack = stack;
    } else {
      Error.captureStackTrace(errorObj, ApiError);
    }
  
    return errorObj;
  };
  
  export default ApiError;
  