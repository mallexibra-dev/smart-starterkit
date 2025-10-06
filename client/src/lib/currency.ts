/**
 * Format angka ke format Rupiah Indonesia
 * @param amount - Jumlah uang yang akan diformat
 * @param options - Opsi formatting
 * @returns String format Rupiah (contoh: "Rp. 1.000.000")
 */
export function formatRupiah(
  amount: number | string,
  options: {
    prefix?: string
    decimal?: number
    separator?: string
    decimalSeparator?: string
  } = {}
): string {
  const {
    prefix = 'Rp. ',
    decimal = 0,
    separator = '.',
    decimalSeparator = ','
  } = options

  // Konversi ke number jika string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  // Handle invalid number
  if (isNaN(numAmount)) {
    return `${prefix}0`
  }

  // Format dengan separator ribuan
  const formattedAmount = numAmount
    .toFixed(decimal)
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator)

  return `${prefix}${formattedAmount}`
}

/**
 * Format angka ke format Rupiah Indonesia yang lebih singkat (untuk nilai besar)
 * @param amount - Jumlah uang yang akan diformat
 * @returns String format Rupiah singkat (contoh: "Rp. 1JT", "Rp. 2,5M")
 */
export function formatRupiahShort(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount)) {
    return 'Rp. 0'
  }

  if (numAmount >= 1000000000) {
    return `Rp. ${(numAmount / 1000000000).toFixed(1)}M`
  } else if (numAmount >= 1000000) {
    return `Rp. ${(numAmount / 1000000).toFixed(0)}JT`
  } else if (numAmount >= 1000) {
    return `Rp. ${(numAmount / 1000).toFixed(0)}RB`
  } else {
    return formatRupiah(numAmount)
  }
}

/**
 * Parse string Rupiah kembali ke number
 * @param rupiahString - String format Rupiah
 * @returns Number value
 */
export function parseRupiah(rupiahString: string): number {
  // Hapus semua non-digit characters kecuali decimal separator
  const cleanString = rupiahString.replace(/[^\d,]/g, '').replace(/,/g, '.')
  const parsed = parseFloat(cleanString)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Format angka ke format mata uang umum
 * @param amount - Jumlah uang yang akan diformat
 * @param locale - Locale string (default: 'id-ID')
 * @param currency - Currency code (default: 'IDR')
 * @returns String format mata uang
 */
export function formatCurrency(
  amount: number | string,
  locale: string = 'id-ID',
  currency: string = 'IDR'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount)) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(0)
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(numAmount)
}