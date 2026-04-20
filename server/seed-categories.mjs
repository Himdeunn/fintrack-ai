import { drizzle } from "drizzle-orm/mysql2";
import { categories } from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

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
  try {
    // Get owner ID from environment
    const ownerOpenId = process.env.OWNER_OPEN_ID;
    if (!ownerOpenId) {
      console.error("OWNER_OPEN_ID not set");
      process.exit(1);
    }

    // Get owner user ID
    const { users } = await import("../drizzle/schema.js");
    const ownerUser = await db
      .select()
      .from(users)
      .where((u) => u.openId === ownerOpenId)
      .limit(1);

    if (ownerUser.length === 0) {
      console.error("Owner user not found");
      process.exit(1);
    }

    const userId = ownerUser[0].id;

    // Check if categories already exist
    const existingCategories = await db
      .select()
      .from(categories)
      .where((c) => c.userId === userId)
      .limit(1);

    if (existingCategories.length > 0) {
      console.log("Categories already seeded for this user");
      process.exit(0);
    }

    // Seed income categories
    for (const cat of DEFAULT_CATEGORIES.income) {
      await db.insert(categories).values({
        userId,
        name: cat.name,
        type: "income",
        color: cat.color,
        icon: cat.icon,
      });
    }

    // Seed expense categories
    for (const cat of DEFAULT_CATEGORIES.expense) {
      await db.insert(categories).values({
        userId,
        name: cat.name,
        type: "expense",
        color: cat.color,
        icon: cat.icon,
      });
    }

    console.log("Categories seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
