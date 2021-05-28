import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mediaRoutes from "./media/media.js";
import rewievRoutes from "./rewiews/rewiew.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
} from "./errorHandlers.js";
import createError from "http-errors";

const server = express();
const port = process.env.PORT || 3001;

const whiteList = [
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_CLOUD_URL,
];

const corsOptions = {
  origin: function (origin, next) {
    console.log(origin);
    try {
      if (whiteList.indexOf(origin) !== -1) {
        console.log(origin);
        next(null, true);
      } else {
        next(createError(500, "Origin Problem!"));
      }
    } catch (error) {
      next(error);
    }
  },
};

server.use(express.json());
// server.use(express.static(publicFolder));
server.use(cors());

server.use("/media", mediaRoutes);
server.use("/review", rewievRoutes);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(catchAllErrorHandler);

server.listen(port, () => {
  console.log("server is running port: ", port);
});

console.table(listEndpoints(server));
