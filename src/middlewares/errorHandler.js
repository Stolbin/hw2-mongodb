import express from "express";

const app = express();

app.use((error, req, res, next) => {
  res.status(500).send({ message: "Something went wrong" });
});

export default app;
