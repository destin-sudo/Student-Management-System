import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const cache = globalThis as typeof globalThis & { lmsDatabase?: DatabaseSync };

function getDatabasePath() {
  if (process.env.SQLITE_DB_PATH) return process.env.SQLITE_DB_PATH;
  if (process.env.VERCEL) return "/tmp/adaptive-learning.sqlite";
  return join(process.cwd(), ".data", "adaptive-learning.sqlite");
}

function createDatabase() {
  const databasePath = getDatabasePath();
  if (databasePath !== ":memory:") mkdirSync(dirname(databasePath), { recursive: true });
  const database = new DatabaseSync(databasePath);
  database.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  database.exec(readFileSync(join(process.cwd(), "database", "schema.sql"), "utf8"));
  database.exec(readFileSync(join(process.cwd(), "database", "seed.sql"), "utf8"));
  return database;
}

export function getDatabase() {
  cache.lmsDatabase ??= createDatabase();
  return cache.lmsDatabase;
}
