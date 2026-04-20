export function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRupiahShort(amount: number) {
  if (amount >= 1_000_000) return `Rp${(amount / 1_000_000).toFixed(1)}jt`
  if (amount >= 1_000) return `Rp${(amount / 1_000).toFixed(0)}rb`
  return `Rp${amount}`
}