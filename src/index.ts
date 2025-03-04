import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import config from "./config";

import routes from "./routes";
import errorHandler, { notFound } from "./middleware/errors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send(`letstube Be is Up and Running In ${config.env} mode`);
});
app.use("/api/v1", routes);

// Handle 404 errors
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
