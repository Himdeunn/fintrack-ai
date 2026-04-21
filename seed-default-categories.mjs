import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connectionString = process.env.DATABASE_URL;

const DEFAULT_CATEGORIES = {
  income: [
    { name: "Gaji", color: "#10b981", icon: "briefcase" },
    { name: "Bonus", color: "#06b6d4", icon: "gift" },
    { name: "Investasi", color: "#f59e0b", icon: "trending-up" },
    { name: "Freelance", color: "#8b5cf6", icon: "code" },
    { name: "Lainnya", color: "#6b7280", icon: "help-circle" },
  ],
  expense: [
    { name: "Makanan & Minuman", color: "#ef4444", icon: "utensils" },
    { name: "Transportasi", color: "#f97316", icon: "car" },
    { name: "Hiburan", color: "#ec4899", icon: "music" },
    { name: "Belanja", color: "#d946ef", icon: "shopping-bag" },
    { name: "Tagihan", color: "#0ea5e9", icon: "file-text" },
    { name: "Kesehatan", color: "#06b6d4", icon: "heart" },
    { name: "Pendidikan", color: "#3b82f6", icon: "book" },
    { name: "Asuransi", color: "#6366f1", icon: "shield" },
    { name: "Cicilan", color: "#8b5cf6", icon: "credit-card" },
    { name: "Lainnya", color: "#6b7280", icon: "help-circle" },
  ],
};

async function seedCategories() {
  let connection;
  try {
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

    // Get owner user ID
    const ownerOpenId = process.env.OWNER_OPEN_ID;
    if (!ownerOpenId) {
      throw new Error("OWNER_OPEN_ID environment variable not set");
    }

    console.log(`\nFetching owner user with openId: ${ownerOpenId}`);
    const [users] = await connection.execute(
      "SELECT id FROM users WHERE openId = ?",
      [ownerOpenId]
    );

    if (users.length === 0) {
      throw new Error(`Owner user not found with openId: ${ownerOpenId}`);
    }

    const userId = users[0].id;
    console.log(`✓ Found owner user with ID: ${userId}`);

    // Check if categories already exist for this user
    const [existingCategories] = await connection.execute(
      "SELECT COUNT(*) as count FROM categories WHERE userId = ?",
      [userId]
    );

    if (existingCategories[0].count > 0) {
      console.log(`⚠ Categories already exist for user ${userId} (${existingCategories[0].count} categories)`);
      console.log("Skipping seeding...");
      await connection.end();
      return;
    }

    console.log("\nSeeding income categories...");
    for (const cat of DEFAULT_CATEGORIES.income) {
      await connection.execute(
        "INSERT INTO categories (userId, name, type, color, icon) VALUES (?, ?, ?, ?, ?)",
        [userId, cat.name, "income", cat.color, cat.icon]
      );
      console.log(`  ✓ ${cat.name}`);
    }

    console.log("\nSeeding expense categories...");
    for (const cat of DEFAULT_CATEGORIES.expense) {
      await connection.execute(
        "INSERT INTO categories (userId, name, type, color, icon) VALUES (?, ?, ?, ?, ?)",
        [userId, cat.name, "expense", cat.color, cat.icon]
      );
      console.log(`  ✓ ${cat.name}`);
    }

    console.log("\n✓ Seeding completed successfully!");

    // Verify
    const [verifyIncome] = await connection.execute(
      "SELECT COUNT(*) as count FROM categories WHERE userId = ? AND type = ?",
      [userId, "income"]
    );
    const [verifyExpense] = await connection.execute(
      "SELECT COUNT(*) as count FROM categories WHERE userId = ? AND type = ?",
      [userId, "expense"]
    );

    console.log(`\nVerification:`);
    console.log(`  Income categories: ${verifyIncome[0].count}`);
    console.log(`  Expense categories: ${verifyExpense[0].count}`);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedCategories();
