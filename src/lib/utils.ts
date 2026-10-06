import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(d)
}

export function formatSalary(salary: string | null | undefined): string {
  if (!salary) return 'Salary not specified'
  return salary
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const jobTypeColors: Record<string, string> = {
  FULL_TIME: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  PART_TIME: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  CONTRACT: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  INTERNSHIP: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  REMOTE: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
}

export const applicationStatusColors: Record<string, string> = {
  PENDING: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
  REVIEWED: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  INTERVIEW: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  ACCEPTED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  REJECTED: 'bg-red-500/15 text-red-300 border-red-500/30',
}

export const applicationStatusLabels: Record<string, string> = {
  PENDING: 'Pending Review',
  REVIEWED: 'Under Review',
  INTERVIEW: 'Interview Scheduled',
  ACCEPTED: 'Accepted',
  REJECTED: 'Not Selected',
}

export function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-blue-400'
  if (score >= 40) return 'text-yellow-400'
  return 'text-red-400'
}

export function getMatchScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent Match'
  if (score >= 60) return 'Good Match'
  if (score >= 40) return 'Fair Match'
  return 'Poor Match'
}