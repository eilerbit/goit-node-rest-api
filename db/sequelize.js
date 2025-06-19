import { Sequelize } from "sequelize";

const DB_URL = "postgresql://contacts_gnpd_user:oVY2PK7wbowQI6qdxvN994MykK4mVTUt@dpg-d18t656mcj7s73ae1nkg-a.frankfurt-postgres.render.com/contacts_gnpd";

const sequelize = new Sequelize(DB_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};

export { sequelize, connectDB };
