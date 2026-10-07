import { cn } from '@/lib/utils'

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'error' | 'success' | 'info'
}

const styles = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  info: 'border-zinc-200 bg-zinc-50 text-zinc-700',
}

export function Alert({ variant = 'info', className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn('rounded border px-4 py-3 text-sm', styles[variant], className)}
      {...props}
    />
  )
}