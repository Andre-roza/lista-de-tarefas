import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export default function Select({ label, options, className, id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-purple-muted">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'px-3 py-2 rounded-xl border border-purple-border bg-purple-card text-sm text-purple-light',
          'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent',
          className
        )}
        {...props}
      >
        {options.map(op => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>
    </div>
  )
}
