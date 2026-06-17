import express from "express";

import config from "./configs/config.js";
import checkAuth from "./middlewares/checkAuth.js";
import customRoutes from "./routes/index.router.js";

const app = express();

app.use(express.json({ limit: config.limit.maxJsonSize }));
app.use(
  express.urlencoded({ extended: true, limit: config.limit.maxJsonSize }),
);

app.use(checkAuth);

app.use("/api/v1", customRoutes);

app.get("/", (req, res) => {
  res.status(200).send({
    connected: true,
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
