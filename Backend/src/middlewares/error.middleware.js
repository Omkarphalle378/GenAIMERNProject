/**
 * Centralized Express Error Handling Middleware.
 */
function errorHandler(err, req, res, next) {
  console.error("Unhandled Error:", err.stack || err);

  const statusCode = err.statusCode || (res.statusCode && res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}

module.exports = errorHandler;
