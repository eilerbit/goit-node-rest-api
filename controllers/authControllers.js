import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { generateToken } from "../helpers/generateToken.js";

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existing = await User.findOne({ where: { email } });

        if (existing) {
            return res.status(409).json({ message: "Email in use" });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hash });

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Email or password is wrong" });
        }

        const token = generateToken(user.id);
        user.token = token;
        await user.save();

        res.status(200).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        req.user.token = null;
        await req.user.save();
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const { email, subscription } = req.user;
        res.status(200).json({ email, subscription });
    } catch (error) {
        next(error);
    }
};

export const updateSubscription = async (req, res, next) => {
    try {
        const { subscription } = req.body;
        req.user.subscription = subscription;
        await req.user.save();
        res.status(200).json({
            email: req.user.email,
            subscription: req.user.subscription,
        });
    } catch (error) {
        next(error);
    }
};
