import express, { Request, Response } from "express";
import {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/User.controller";
const userRoute = express.Router();

userRoute.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// userRoute.get("/", (req: Request, res: Response) => {
//   res.send("Hello World");
// });

userRoute.post("/create", (req: Request, res: Response) =>
  createUser(req, res)
);

userRoute.post("/login", (req: Request, res: Response) => loginUser(req, res));

userRoute.post("/forgotpassword", (req: Request, res: Response) =>
  forgotPassword(req, res)
);

userRoute.post("/resetpassword", (req: Request, res: Response) => {
  resetPassword(req, res);
});

export default userRoute;
