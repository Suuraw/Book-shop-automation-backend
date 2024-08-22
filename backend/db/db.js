// db/db.js
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Users",
    password: "sujay123",
    port: "5432",
});

db.connect();

export default db;
