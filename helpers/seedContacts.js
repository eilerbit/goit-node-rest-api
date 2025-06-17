import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Contact from "../models/contactModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SHOULD_SEED = true;

export async function seedContactsIfNeeded() {
    const count = await Contact.count();
    if (count === 0 && SHOULD_SEED) {
        const filePath = path.resolve(__dirname, "../db/contacts.json");
        const json = await fs.readFile(filePath, "utf-8");
        const rawContacts = JSON.parse(json);

        const contacts = rawContacts.map(({ id, ...rest }) => ({
            ...rest,
            favorite: false,
        }));

        await Contact.bulkCreate(contacts);
        console.log("✅ Seeded contacts from contacts.json (generated ids)");
    }
}
