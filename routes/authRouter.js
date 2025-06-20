import express from "express";
import {
    register,
    login,
    logout,
    getCurrentUser,
    updateSubscription,
} from "../controllers/authControllers.js";
import auth from "../middlewares/auth.js";
import validateBody from "../helpers/validateBody.js";
import {
    registerSchema,
    loginSchema,
    subscriptionSchema,
} from "../schemas/userSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, getCurrentUser);
authRouter.patch("/subscription", auth, validateBody(subscriptionSchema), updateSubscription);

export default authRouter;
