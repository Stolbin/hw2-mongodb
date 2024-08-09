export const authErrorHendler = (err, req, res, next) => {
  res.status(409).json({
    status: 409,
    message: "Email in use",
    data: { message: "Email in use" },
  });
  next();
};

export const loginErrorHendler = (err, req, res, next) => {
  res.status(401).json({
    status: 401,
    message: "Unauthorized",
    data: { message: "Unauthorized" },
  });
  next();
};

export const userNotFoundHendler = (err, req, res, next) => {
  res.status(404).json({
    status: 404,
    message: "User not found",
    data: { message: "User not found" },
  });
  next();
};
