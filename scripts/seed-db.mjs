import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = process.env.SQLITE_DB_PATH || join(process.cwd(), ".data", "adaptive-learning.sqlite");
if (databasePath !== ":memory:") mkdirSync(dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
database.exec(readFileSync(join(process.cwd(), "database", "schema.sql"), "utf8"));
database.exec(readFileSync(join(process.cwd(), "database", "seed.sql"), "utf8"));
database.close();
console.log(`SQLite schema and demo records are ready at ${databasePath}`);
