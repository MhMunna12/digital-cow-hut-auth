import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
import routes from "./app/routes";
import cookieParser from "cookie-parser";
const app: Application = express();
const port = 5000;
//cors
app.use(cors());
//parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//application routes

app.use("/api/v1/", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello cow!");
});

//global error handler
app.use(globalErrorHandler);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "Api not found",
      },
    ],
  });
  next();
});

export default app;
