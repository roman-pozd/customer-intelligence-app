import { Pool } from "pg";

function buildPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Aiven Apps: DATABASE_URL provided, strip sslmode from URL and use CA cert
    const url = new URL(databaseUrl);
    url.searchParams.delete("sslmode");

    const ca = process.env.PROJECT_CA_CERT
      ? Buffer.from(process.env.PROJECT_CA_CERT, "base64").toString()
      : undefined;

    return new Pool({
      connectionString: url.toString(),
      ssl: ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: false },
    });
  }

  // Local dev: individual env vars
  return new Pool({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || "23537"),
    database: process.env.PG_DATABASE || "defaultdb",
    user: process.env.PG_USER || "avnadmin",
    password: process.env.PG_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });
}

const pool = buildPool();
export default pool;
