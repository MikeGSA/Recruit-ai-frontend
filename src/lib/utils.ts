/**
 * Utility functions for the Recruit-AI frontend application.
 */

import type { ScreeningResult } from '@/types';

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format a date string to include time
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Get the color class for a candidate status
 */
export function getStatusColor(
  status: string
): 'text-green-600' | 'text-blue-600' | 'text-yellow-600' | 'text-red-600' {
  if (status.includes('Qualified')) return 'text-green-600';
  if (status === 'Borderline') return 'text-yellow-600';
  if (status === 'Rejected') return 'text-red-600';
  return 'text-blue-600';
}

/**
 * Get background color for a status badge
 */
export function getStatusBgColor(
  status: string
): 'bg-green-50' | 'bg-blue-50' | 'bg-yellow-50' | 'bg-red-50' {
  if (status.includes('Qualified')) return 'bg-green-50';
  if (status === 'Borderline') return 'bg-yellow-50';
  if (status === 'Rejected') return 'bg-red-50';
  return 'bg-blue-50';
}

/**
 * Sort candidates by fit score (descending)
 */
export function sortByCandidateScore(
  candidates: ScreeningResult[]
): ScreeningResult[] {
  return [...candidates].sort((a, b) => b.fit_score - a.fit_score);
}

/**
 * Sort candidates by creation date (newest first)
 */
export function sortByCreationDate(candidates: ScreeningResult[]): ScreeningResult[] {
  return [...candidates].sort((a, b) => {
    const dateA = new Date(a.candidate.email).getTime();
    const dateB = new Date(b.candidate.email).getTime();
    return dateB - dateA;
  });
}

/**
 * Get average fit score for a list of candidates
 */
export function getAverageFitScore(candidates: ScreeningResult[]): number {
  if (candidates.length === 0) return 0;
  const sum = candidates.reduce((acc, c) => acc + c.fit_score, 0);
  return Math.round(sum / candidates.length);
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '…';
}

/**
 * Check if email is valid (basic validation)
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
