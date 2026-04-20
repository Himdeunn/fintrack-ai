import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Transaction } from '@/types/database'
import type { TransactionFormData } from '@/lib/validations'

const QUERY_KEY = 'transactions'

export function useTransactions(month?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: [QUERY_KEY, month],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (month) {
        const [year, m] = month.split('-')
        const start = `${year}-${m}-01`
        const end = new Date(+year, +m, 0).toISOString().split('T')[0]
        query = query.gte('date', start).lte('date', end)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Transaction[]
    },
  })
}

export function useCreateTransaction() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TransactionFormData) => {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('transactions').insert({
        ...data,
        amount: Number(data.amount),
        user_id: user!.id,
      })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useUpdateTransaction() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TransactionFormData }) => {
      const { error } = await supabase
        .from('transactions')
        .update({ ...data, amount: Number(data.amount) })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useDeleteTransaction() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}