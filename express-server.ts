
import express from "express";
import cors from "cors";
import "dotenv/config";
import { Prisma } from "./generated/prisma/client.js";
import userRoutes from "./routes/user-routes.js";
import postRoutes from "./routes/post-routes.js";

const app = express();
app.use(cors({origin:"http://localhost:5173"}))
app.use(express.json());
app.use("/users", userRoutes);
app.use("/", postRoutes);


app.get("/test-error", (req, res, next) => {
  next(new Error("Something failed during processing"));
});

app.use((
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (err.code === "P2002") {
      return res.status(409).json({
        message: "A record with this value already exists",
      });
    }
  }

  return res.status(500).json({
    message: "Something went wrong on the server",
  });
});
const PORT=Number(process.env.PORT)||4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
