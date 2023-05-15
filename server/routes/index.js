import userRouter from "./user.js";
import { notFound, errorHandler } from "../middlewares/errHandler.js";

const initRoutes = (app) => {
  app.use("/auth/user", userRouter);

  app.use(notFound);
  app.use(errorHandler);
};

export default initRoutes;
