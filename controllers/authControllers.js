import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import User from "../models/userModel.js";
import { generateToken } from "../helpers/generateToken.js";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { sendEmail } from "../helpers/sendEmail.js";

const avatarsDir = path.resolve("public", "avatars");

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existing = await User.findOne({ where: { email } });

        if (existing) {
            return res.status(409).json({ message: "Email in use" });
        }

        const hash = await bcrypt.hash(password, 10);
        const verificationToken = nanoid();
        const avatarURL = gravatar.url(email, { s: "200", d: "retro" }, true);
        const newUser = await User.create({ email, password: hash, avatarURL: avatarURL, verificationToken, verify: false, });

        const verifyLink = `http://localhost:3000/api/auth/verify/${verificationToken}`;
        await sendEmail(
            email,
            "Verify your email",
            `<a href="${verifyLink}">Click to verify your email</a>`
        );

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

        if (!user.verify) {
            return res.status(401).json({ message: "Email is not verified" });
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

export const updateAvatar = async (req, res, next) => {
    try {
        const { path: tempPath, filename } = req.file;
        const ext = path.extname(filename);
        const newFilename = `${req.user.id}${ext}`;
        const newPath = path.join(avatarsDir, newFilename);

        await fs.rename(tempPath, newPath);
        const avatarURL = `/avatars/${newFilename}`;

        req.user.avatarURL = avatarURL;
        await req.user.save();

        res.status(200).json({ avatarURL });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ where: { verificationToken } });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Verification successful" });
};

export const resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "missing required field email" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verify) {
            return res.status(400).json({ message: "Verification has already been passed" });
        }

        const verifyLink = `http://localhost:3000/api/auth/verify/${user.verificationToken}`;
        await sendEmail(
            email,
            "Verify your email",
            `<a href="${verifyLink}">Click to verify your email</a>`
        );

        res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
        next(error);
    }
};