import { describe, expect, it, beforeAll } from "vitest";
import * as db from "./db";

describe("Database Queries", () => {
  const testUserId = 1; // Owner user ID

  beforeAll(async () => {
    // Ensure database is connected
    const database = await db.getDb();
    expect(database).toBeDefined();
  });

  describe("Transaction Queries", () => {
    it("should retrieve transactions for a user", async () => {
      const transactions = await db.getTransactions(testUserId);
      expect(Array.isArray(transactions)).toBe(true);
    });

    it("should filter transactions by date range", async () => {
      const startDate = new Date("2026-03-01");
      const endDate = new Date("2026-04-30");
      const transactions = await db.getTransactions(testUserId, {
        startDate,
        endDate,
      });
      expect(Array.isArray(transactions)).toBe(true);
    });

    it("should filter transactions by type", async () => {
      const transactions = await db.getTransactions(testUserId, {
        type: "expense",
      });
      expect(Array.isArray(transactions)).toBe(true);
    });
  });

  describe("Category Queries", () => {
    it("should retrieve all categories for a user", async () => {
      const categories = await db.getCategories(testUserId);
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });

    it("should retrieve only income categories", async () => {
      const categories = await db.getCategories(testUserId, "income");
      expect(Array.isArray(categories)).toBe(true);
      categories.forEach((cat) => {
        expect(cat.type).toBe("income");
      });
    });

    it("should retrieve only expense categories", async () => {
      const categories = await db.getCategories(testUserId, "expense");
      expect(Array.isArray(categories)).toBe(true);
      categories.forEach((cat) => {
        expect(cat.type).toBe("expense");
      });
    });
  });

  describe("Budget Queries", () => {
    it("should retrieve budgets for a user", async () => {
      const budgets = await db.getBudgets(testUserId);
      expect(Array.isArray(budgets)).toBe(true);
    });
  });

  describe("Profile Queries", () => {
    it("should retrieve or create profile for a user", async () => {
      const profile = await db.getOrCreateProfile(testUserId, "Test User");
      expect(profile).toBeDefined();
      expect(profile?.userId).toBe(testUserId);
    });
  });
});
