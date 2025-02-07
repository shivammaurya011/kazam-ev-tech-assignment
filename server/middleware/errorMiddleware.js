const errorMiddleware = (err, req, res, next) => {
    console.error(`Error: ${err.message}`);
  
    // Default status code & message
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
  
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(err.errors).map((val) => val.message).join(", ");
    }
  
    if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token, authorization denied";
    }
  
    if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired, please log in again";
    }
  
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  };
  
  export default errorMiddleware;
  