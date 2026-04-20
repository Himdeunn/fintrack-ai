import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Profile procedures
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrCreateProfile(ctx.user.id, ctx.user.name || undefined);
    }),
    update: protectedProcedure
      .input(z.object({
        fullName: z.string().optional(),
        currency: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.updateProfile(ctx.user.id, input);
      }),
  }),

  // Category procedures
  categories: router({
    list: protectedProcedure
      .input(z.object({
        type: z.enum(["income", "expense"]).optional(),
      }))
      .query(async ({ ctx, input }) => {
        return db.getCategories(ctx.user.id, input.type);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        type: z.enum(["income", "expense"]),
        color: z.string().optional(),
        icon: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createCategory(ctx.user.id, input);
      }),
  }),

  // Transaction procedures
  transactions: router({
    list: protectedProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        categoryId: z.number().optional(),
        type: z.enum(["income", "expense"]).optional(),
      }))
      .query(async ({ ctx, input }) => {
        return db.getTransactions(ctx.user.id, input);
      }),
    create: protectedProcedure
      .input(z.object({
        categoryId: z.number(),
        type: z.enum(["income", "expense"]),
        amount: z.string(),
        description: z.string().optional(),
        notes: z.string().optional(),
        date: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createTransaction(ctx.user.id, {
          ...input,
          amount: input.amount as any,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        categoryId: z.number().optional(),
        type: z.enum(["income", "expense"]).optional(),
        amount: z.string().optional(),
        description: z.string().optional(),
        notes: z.string().optional(),
        date: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateTransaction(ctx.user.id, id, {
          ...data,
          amount: data.amount as any,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteTransaction(ctx.user.id, input.id);
      }),
  }),

  // Budget procedures
  budgets: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getBudgets(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        categoryId: z.number(),
        limit: z.string(),
        alertThreshold: z.string().optional(),
        period: z.enum(["monthly", "yearly"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createBudget(ctx.user.id, {
          ...input,
          limit: input.limit as any,
          alertThreshold: input.alertThreshold as any,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        limit: z.string().optional(),
        alertThreshold: z.string().optional(),
        period: z.enum(["monthly", "yearly"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return db.updateBudget(ctx.user.id, id, {
          ...data,
          limit: data.limit as any,
          alertThreshold: data.alertThreshold as any,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteBudget(ctx.user.id, input.id);
      }),
  }),

  // AI Insights procedures
  insights: router({
    weeklySummary: protectedProcedure.query(async ({ ctx }) => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const transactions = await db.getTransactions(ctx.user.id, {
        startDate: weekAgo,
        endDate: now,
      });

      if (transactions.length === 0) {
        return {
          summary: "Belum ada transaksi minggu ini.",
          transactions: [],
        };
      }

      const prompt = `Berikut adalah data transaksi keuangan saya selama seminggu terakhir:
${JSON.stringify(transactions.map(t => ({
  type: t.type,
  amount: t.amount,
  description: t.description,
  date: t.date,
})), null, 2)}

Berikan ringkasan singkat dalam 3-4 poin tentang kondisi keuangan saya minggu ini. Format: poin-poin yang jelas dan actionable.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Anda adalah financial advisor yang membantu pengguna memahami kondisi keuangan mereka." },
          { role: "user", content: prompt },
        ],
      });

      const summary = response.choices[0]?.message.content || "Tidak dapat menghasilkan ringkasan.";

      return {
        summary,
        transactions,
      };
    }),

    healthScore: protectedProcedure.query(async ({ ctx }) => {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const transactions = await db.getTransactions(ctx.user.id, {
        startDate: monthAgo,
        endDate: now,
      });

      const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

      const expenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

      const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

      const prompt = `Berdasarkan data keuangan berikut:
- Total Pemasukan (30 hari): ${income}
- Total Pengeluaran (30 hari): ${expenses}
- Tingkat Tabungan: ${savingsRate.toFixed(2)}%

Berikan skor kesehatan keuangan (0-100) dan penjelasan singkat (2-3 kalimat) tentang kondisi finansial pengguna.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Anda adalah financial advisor yang memberikan skor kesehatan keuangan." },
          { role: "user", content: prompt },
        ],
      });

      const analysis = response.choices[0]?.message.content || "Tidak dapat menganalisis kesehatan keuangan.";

      return {
        income,
        expenses,
        savingsRate,
        analysis,
      };
    }),

    savingsTips: protectedProcedure.query(async ({ ctx }) => {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const transactions = await db.getTransactions(ctx.user.id, {
        startDate: monthAgo,
        endDate: now,
        type: "expense",
      });

      const categories = await db.getCategories(ctx.user.id, "expense");

      const categorySpending = categories.map(cat => {
        const total = transactions
          .filter(t => t.categoryId === cat.id)
          .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
        return { category: cat.name, total };
      }).sort((a, b) => b.total - a.total);

      const prompt = `Berdasarkan pengeluaran kategori saya berikut:
${categorySpending.map(cs => `- ${cs.category}: ${cs.total}`).join("\n")}

Berikan 3 tips penghematan yang spesifik dan actionable untuk mengurangi pengeluaran saya.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Anda adalah financial advisor yang memberikan tips penghematan personal." },
          { role: "user", content: prompt },
        ],
      });

      const tips = response.choices[0]?.message.content || "Tidak dapat menghasilkan tips penghematan.";

      return {
        categorySpending,
        tips,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
