import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get initials from a name string
 * @param name - The name to get initials from
 * @returns The initials (first letter of each word, or first letter if single word)
 */
export function getInitials(name: string): string {
  if (!name || name.trim() === '') return '';
  
  const words = name.trim().split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0].toUpperCase();
  
  return words.map(n => n[0]).join('').toUpperCase();
}

/**
 * Get user initials from first and last name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns The initials
 */
export function getUserInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  
  if (!first && !last) return '';
  if (!first) return last[0]?.toUpperCase() || '';
  if (!last) return first[0]?.toUpperCase() || '';
  
  return `${first[0]}${last[0]}`.toUpperCase();
}
