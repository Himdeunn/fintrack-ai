import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '@/lib/actions/transactions'
import type { TransactionFormData } from '@/lib/validations'
import { toast } from 'sonner'
import { useLanguage } from '@/components/providers/LanguageProvider'

const QUERY_KEY = 'transactions'

export function useTransactions(month?: string) {
  return useQuery({
    queryKey: [QUERY_KEY, month],
    queryFn: () => getTransactions(month),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  const { language } = useLanguage()

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success(language === 'id' ? 'Transaksi berhasil ditambahkan' : 'Transaction added successfully')
    },
    onError: () => {
      toast.error(language === 'id' ? 'Gagal menambahkan transaksi' : 'Failed to add transaction')
    }
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  const { language } = useLanguage()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransactionFormData }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success(language === 'id' ? 'Transaksi berhasil diperbarui' : 'Transaction updated successfully')
    },
    onError: () => {
      toast.error(language === 'id' ? 'Gagal memperbarui transaksi' : 'Failed to update transaction')
    }
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  const { language } = useLanguage()

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success(language === 'id' ? 'Transaksi berhasil dihapus' : 'Transaction deleted successfully')
    },
    onError: () => {
      toast.error(language === 'id' ? 'Gagal menghapus transaksi' : 'Failed to delete transaction')
    }
  })
}
