import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
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
  FULL_TIME: 'bg-red-50 text-red-700 border-red-200',
  PART_TIME: 'bg-zinc-50 text-zinc-700 border-zinc-300',
  CONTRACT: 'bg-zinc-50 text-zinc-700 border-zinc-300',
  INTERNSHIP: 'bg-zinc-50 text-zinc-700 border-zinc-300',
  REMOTE: 'bg-zinc-50 text-zinc-700 border-zinc-300',
}

export const applicationStatusColors: Record<string, string> = {
  PENDING: 'bg-zinc-50 text-zinc-600 border-zinc-300',
  REVIEWED: 'bg-zinc-100 text-zinc-800 border-zinc-300',
  INTERVIEW: 'bg-red-50 text-red-700 border-red-200',
  ACCEPTED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-zinc-100 text-zinc-500 border-zinc-200',
}

export const applicationStatusLabels: Record<string, string> = {
  PENDING: 'Pending review',
  REVIEWED: 'Under review',
  INTERVIEW: 'Interview scheduled',
  ACCEPTED: 'Accepted',
  REJECTED: 'Not selected',
}

export function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'text-red-700'
  if (score >= 60) return 'text-red-600'
  if (score >= 40) return 'text-zinc-700'
  return 'text-zinc-400'
}

export function getMatchScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent match'
  if (score >= 60) return 'Good match'
  if (score >= 40) return 'Fair match'
  return 'Weak match'
}