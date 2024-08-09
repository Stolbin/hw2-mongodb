export const errorHandler = (err, req, res) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};
