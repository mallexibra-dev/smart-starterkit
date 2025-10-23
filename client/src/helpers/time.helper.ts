// Re-export time formatting utilities from shared workspace
import {
  formatDate as sharedFormatDate,
  formatDateTime as sharedFormatDateTime,
  formatTime as sharedFormatTime,
  formatRelativeTime,
  isToday,
  addDays,
} from 'shared/src/utils/format.utils';

/**
 * Format date to readable format (English)
 */
export const formatDate = (date: string | Date): string => {
  return sharedFormatDate(date, 'en-US');
};

/**
 * Format time to HH:MM
 */
export const formatTime = (date: string | Date): string => {
  return sharedFormatTime(date, 'en-US');
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  return formatRelativeTime(date, 'en-US');
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: string | Date): string => {
  return sharedFormatDateTime(date, 'en-US');
};

// Re-export other utilities
export { isToday, addDays };

export default {
  formatDate,
  formatTime,
  getRelativeTime,
  formatDateTime,
  isToday,
  addDays,
};
