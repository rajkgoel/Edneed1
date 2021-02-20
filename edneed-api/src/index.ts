import express, { Application } from "express";
import morgan from "morgan";
import Router from "./routes";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8000;

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: "/swagger.json",
      },
    })
  );
app.use(Router);
mongoose.connect(
  "mongodb://localhost:27017/edneedDb", 
  {
    useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true
  },
  () => {
    console.log("Connected to edneed DB");
  }
);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});