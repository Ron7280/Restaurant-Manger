const { Sequelize } = require("sequelize");
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log(`Connected to PostgreSQL ---> [ ${process.env.DB_NAME} ] DB`);
module.exports = pool;
