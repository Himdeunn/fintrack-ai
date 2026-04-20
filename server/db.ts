import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, profiles, InsertProfile, categories, InsertCategory, transactions, InsertTransaction, budgets, InsertBudget } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Profile queries
export async function getOrCreateProfile(userId: number, fullName?: string) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];

  const newProfile: InsertProfile = {
    userId,
    fullName: fullName || null,
    currency: "IDR",
  };
  await db.insert(profiles).values(newProfile);
  return db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1).then(r => r[0]);
}

export async function updateProfile(userId: number, data: Partial<InsertProfile>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(profiles).set(data).where(eq(profiles.userId, userId));
  return db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1).then(r => r[0]);
}

// Category queries
export async function getCategories(userId: number, type?: "income" | "expense") {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(categories.userId, userId)];
  if (type) conditions.push(eq(categories.type, type));
  
  return db.select().from(categories).where(and(...conditions)).orderBy(asc(categories.name));
}

export async function createCategory(userId: number, data: Omit<InsertCategory, "userId">) {
  const db = await getDb();
  if (!db) return undefined;
  
  const newCategory: InsertCategory = { ...data, userId };
  await db.insert(categories).values(newCategory);
  const result = await db.select().from(categories).where(eq(categories.userId, userId)).orderBy(desc(categories.id)).limit(1);
  return result[0];
}

// Transaction queries
export async function getTransactions(userId: number, filters?: { startDate?: Date; endDate?: Date; categoryId?: number; type?: "income" | "expense" }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(transactions.userId, userId)];
  if (filters?.startDate) conditions.push(gte(transactions.date, filters.startDate));
  if (filters?.endDate) conditions.push(lte(transactions.date, filters.endDate));
  if (filters?.categoryId) conditions.push(eq(transactions.categoryId, filters.categoryId));
  if (filters?.type) conditions.push(eq(transactions.type, filters.type));
  
  return db.select().from(transactions).where(and(...conditions)).orderBy(desc(transactions.date));
}

export async function createTransaction(userId: number, data: Omit<InsertTransaction, "userId">) {
  const db = await getDb();
  if (!db) return undefined;
  
  const newTransaction: InsertTransaction = { ...data, userId };
  await db.insert(transactions).values(newTransaction);
  const result = await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.id)).limit(1);
  return result[0];
}

export async function updateTransaction(userId: number, id: number, data: Partial<InsertTransaction>) {
  const db = await getDb();
  if (!db) return undefined;
  
  // Verify ownership before updating
  const transaction = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
  if (transaction.length === 0 || transaction[0].userId !== userId) {
    throw new Error("Unauthorized: Transaction not found or does not belong to user");
  }
  
  await db.update(transactions).set(data).where(eq(transactions.id, id));
  return db.select().from(transactions).where(eq(transactions.id, id)).limit(1).then(r => r[0]);
}

export async function deleteTransaction(userId: number, id: number) {
  const db = await getDb();
  if (!db) return false;
  
  // Verify ownership before deleting
  const transaction = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
  if (transaction.length === 0 || transaction[0].userId !== userId) {
    throw new Error("Unauthorized: Transaction not found or does not belong to user");
  }
  
  await db.delete(transactions).where(eq(transactions.id, id));
  return true;
}

// Budget queries
export async function getBudgets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(budgets).where(eq(budgets.userId, userId)).orderBy(asc(budgets.id));
}

export async function createBudget(userId: number, data: Omit<InsertBudget, "userId">) {
  const db = await getDb();
  if (!db) return undefined;
  
  const newBudget: InsertBudget = { ...data, userId };
  await db.insert(budgets).values(newBudget);
  const result = await db.select().from(budgets).where(eq(budgets.userId, userId)).orderBy(desc(budgets.id)).limit(1);
  return result[0];
}

export async function updateBudget(userId: number, id: number, data: Partial<InsertBudget>) {
  const db = await getDb();
  if (!db) return undefined;
  
  // Verify ownership before updating
  const budget = await db.select().from(budgets).where(eq(budgets.id, id)).limit(1);
  if (budget.length === 0 || budget[0].userId !== userId) {
    throw new Error("Unauthorized: Budget not found or does not belong to user");
  }
  
  await db.update(budgets).set(data).where(eq(budgets.id, id));
  return db.select().from(budgets).where(eq(budgets.id, id)).limit(1).then(r => r[0]);
}

export async function deleteBudget(userId: number, id: number) {
  const db = await getDb();
  if (!db) return false;
  
  // Verify ownership before deleting
  const budget = await db.select().from(budgets).where(eq(budgets.id, id)).limit(1);
  if (budget.length === 0 || budget[0].userId !== userId) {
    throw new Error("Unauthorized: Budget not found or does not belong to user");
  }
  
  await db.delete(budgets).where(eq(budgets.id, id));
  return true;
}
