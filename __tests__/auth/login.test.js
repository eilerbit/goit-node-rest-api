import { jest } from "@jest/globals";
import { login } from "../../controllers/authControllers.js";
import User from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

describe("Login Controller - Unit Test", () => {
    const mockUser = {
        id: 1,
        email: "test@example.com",
        subscription: "starter",
        password: "$2b$10$abcdefghijklmnopqrstuv",
        validPassword: async () => true,
        save: async () => {}
    };

    beforeEach(() => {
        User.findOne = jest.fn().mockResolvedValue(mockUser);
        jwt.sign = jest.fn(() => "mocked-jwt-token");
        bcrypt.compare = jest.fn().mockResolvedValue(true); // <- змокаємо перевірку пароля
    });

    it("should return token and user object", async () => {
        const req = {
            body: { email: "test@example.com", password: "password123" }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const next = jest.fn();

        await login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            token: "mocked-jwt-token",
            user: {
                email: "test@example.com",
                subscription: "starter"
            }
        });
    });
});
