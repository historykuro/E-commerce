import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import initRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Connect db

const PORT = process.env.PORT || 4200;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.log(`${err} did not connect`));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
initRoutes(app);

app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.send({ message: "Connected to nodejs success" });
});

// Start our server 3200 or 4200
