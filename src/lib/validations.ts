import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z
    .string()
    .min(1, 'Nominal wajib diisi')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: 'Nominal harus lebih dari 0',
    }),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  description: z.string().optional(),
  date: z.string().min(1, 'Tanggal wajib diisi'),
})

export type TransactionFormData = z.infer<typeof transactionSchema>