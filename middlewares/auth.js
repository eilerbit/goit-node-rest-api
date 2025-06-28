import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const auth = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        const { id } = jwt.verify(token, "secret_key");
        const user = await User.findByPk(id);

        if (!user || user.token !== token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).json({ message: "Not authorized" });
    }
};

export default auth;
