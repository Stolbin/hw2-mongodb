import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    console.error("Error details:", err.details);
    const errorMessage = err.details.map((detail) => detail.message).join(", ");
    const error = createHttpError(400, `Bad Request: ${errorMessage}`);
    // const error = createHttpError(400, "Bad Request", { error: err.details });
    next(error);
  }
};
