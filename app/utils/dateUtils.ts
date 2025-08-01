import { format, parseISO, isValid } from 'date-fns';

export function formatUTCDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }
  
  return format(dateObj, 'MMM dd, yyyy HH:mm');
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }
  
  return format(dateObj, 'MMM dd, yyyy');
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid Time';
  }
  
  return format(dateObj, 'HH:mm');
}

export function getCurrentUTCDateTime(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
}

export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
}

export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj > new Date();
}
