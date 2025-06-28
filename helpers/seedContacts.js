import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import Contact from "../models/contactModel.js";
import User from "../models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SHOULD_SEED = true;

export async function seedContactsIfNeeded() {
    if (!SHOULD_SEED) return;

    const contactCount = await Contact.count();
    if (contactCount > 0) return;

    // Ensure at least one user exists
    let user = await User.findOne();
    if (!user) {
        const hashedPassword = await bcrypt.hash("testpassword", 10);
        user = await User.create({
            email: "test@example.com",
            password: hashedPassword,
        });
        console.log("✅ Created test user: test@example.com / testpassword");
    }

    // Read and seed contacts
    const filePath = path.resolve(__dirname, "../db/contacts.json");
    const json = await fs.readFile(filePath, "utf-8");
    const rawContacts = JSON.parse(json);

    const contacts = rawContacts.map(({ id, ...contact }) => ({
        ...contact,
        owner: user.id,
    }));

    await Contact.bulkCreate(contacts);
    console.log("✅ Seeded contacts with owner:", user.email);
}
