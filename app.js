import express from "express";
import morgan from "morgan";
import cors from "cors";
import fs from "fs";
import path from "path";

import { sequelize, connectDB } from "./db/sequelize.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import Contact from "./models/contactModel.js";
import User from "./models/userModel.js";
import auth from "./middlewares/auth.js";
import { seedContactsIfNeeded } from "./helpers/seedContacts.js";

const tempDir = path.resolve("temp")
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

await connectDB();

User.hasMany(Contact, { foreignKey: "owner", as: "contacts" });
Contact.belongsTo(User, { foreignKey: "owner", as: "user" });

await sequelize.sync({ alter: true });
await seedContactsIfNeeded();

const app = express();

app.use(express.static("public"));
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", auth, contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
