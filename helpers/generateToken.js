import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, "secret_key", { expiresIn: "24h" });
};
