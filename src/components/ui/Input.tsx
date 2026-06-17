import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-purple-muted">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'px-3 py-2 rounded-xl border border-purple-border bg-purple-card text-sm text-purple-light',
          'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent',
          'placeholder:text-purple-dim/50',
          className
        )}
        {...props}
      />
    </div>
  )
}
