import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import { connectDB } from "./db/sequelize.js";
import Contact from "./models/contactModel.js";
import User from "./models/userModel.js";
import { seedContactsIfNeeded } from "./helpers/seedContacts.js";

await connectDB();
await Contact.sync();
await User.sync();
await seedContactsIfNeeded();

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
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
