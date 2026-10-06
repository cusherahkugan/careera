import { cn } from '@/lib/utils'

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'error' | 'success' | 'info'
}

const styles = {
  error: 'border-red-500/40 bg-red-500/10 text-red-300',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  info: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
}

export function Alert({ variant = 'info', className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn('rounded-lg border px-4 py-3 text-sm', styles[variant], className)}
      {...props}
    />
  )
}