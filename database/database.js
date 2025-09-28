import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(process.env.DB, process.env.db_USERNAME, process.env.db_PASSWORD, {
    dialect: process.env.db_DIALECT,
    host: process.env.db_HOST,
});
