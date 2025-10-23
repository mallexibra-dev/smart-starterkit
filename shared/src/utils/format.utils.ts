// Format currency values
export function formatCurrency(amount: number, currency: string = 'IDR', locale: string = 'id-ID'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Format numbers with thousands separators
export function formatNumber(num: number, locale: string = 'id-ID'): string {
  return new Intl.NumberFormat(locale).format(num);
}

// Format file sizes
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format dates
export function formatDate(
  date: string | Date,
  locale: string = 'id-ID',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

// Format dates with time
export function formatDateTime(
  date: string | Date,
  locale: string = 'id-ID',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

// Format time only (HH:MM)
export function formatTime(date: string | Date, locale: string = 'id-ID'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date, locale: string = 'id-ID'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // English version for fallback
  if (locale !== 'id-ID') {
    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }

  // Indonesian version (default)
  if (diffInSeconds < 60) {
    return 'baru saja';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} hari yang lalu`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} tahun yang lalu`;
}

// Check if date is today
export function isToday(date: string | Date): boolean {
  const today = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  return today.toDateString() === targetDate.toDateString();
}

// Add days to date
export function addDays(date: string | Date, days: number): Date {
  const result = typeof date === 'string' ? new Date(date) : date;
  result.setDate(result.getDate() + days);
  return result;
}

// Format text with capitalization
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Format text with title case
export function titleCase(text: string): string {
  if (!text) return text;
  return text.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

// Format phone number (Indonesian format)
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format based on length
  if (cleaned.startsWith('0')) {
    if (cleaned.length <= 9) {
      // Mobile format: 0812-3456-789
      return cleaned.replace(/(\d{4})(\d{4})(\d{1,3})/, '$1-$2-$3');
    } else {
      // Landline format: 021-1234-5678
      return cleaned.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
    }
  }

  // International format: +62-812-3456-7890
  if (cleaned.startsWith('62')) {
    return `+${cleaned.substring(0, 2)}-${cleaned.substring(2, 5)}-${cleaned.substring(5, 9)}-${cleaned.substring(9)}`;
  }

  return phone;
}