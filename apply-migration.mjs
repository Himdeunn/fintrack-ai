import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import fs from "fs";

const connectionString = process.env.DATABASE_URL;

async function applyMigration() {
  let connection;
  try {
    // Parse connection string
    const url = new URL(connectionString);
    const config = {
      host: url.hostname,
      port: parseInt(url.port || "3306"),
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1),
      ssl: url.searchParams.get("ssl") ? JSON.parse(url.searchParams.get("ssl")) : undefined,
    };

    console.log("Connecting to database...");
    connection = await mysql.createConnection(config);
    console.log("✓ Connected successfully");

    // Read migration SQL
    const migrationSql = fs.readFileSync("./drizzle/0001_pretty_zuras.sql", "utf-8");
    
    // Split by statement-breakpoint and execute each statement
    const statements = migrationSql
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`Found ${statements.length} statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
      try {
        await connection.execute(statement);
        console.log(`✓ Statement ${i + 1} executed successfully`);
      } catch (error) {
        // Ignore "table already exists" errors
        if (error.code === "ER_TABLE_EXISTS_ERROR") {
          console.log(`⚠ Table already exists (skipping)`);
        } else {
          throw error;
        }
      }
    }

    console.log("\n✓ Migration completed successfully!");

    // Verify tables exist
    console.log("\nVerifying tables...");
    const [tables] = await connection.execute("SHOW TABLES");
    console.log("Tables created:", tables.map((t) => Object.values(t)[0]));

  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

applyMigration();
