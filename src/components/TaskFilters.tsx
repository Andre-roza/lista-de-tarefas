'use client'

import { cn } from '@/lib/utils'
import type { Filter } from '@/types'

interface TaskFiltersProps {
  current: Filter
  onChange: (filter: Filter) => void
  counts: { todas: number; hoje: number; pendentes: number; concluidas: number }
}

const filters: { value: Filter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'hoje', label: 'Hoje' },
  { value: 'pendentes', label: 'Pendentes' },
  { value: 'concluidas', label: 'Concluídas' },
]

export default function TaskFilters({ current, onChange, counts }: TaskFiltersProps) {
  return (
    <div className="flex gap-1 p-1 bg-purple-card/50 rounded-xl border border-purple-border overflow-x-auto scrollbar-none">
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            'flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex-1 sm:flex-none',
            current === f.value
              ? 'bg-gradient-to-r from-accent-from to-accent-to text-white shadow-lg shadow-accent/25'
              : 'text-purple-muted hover:text-purple-light'
          )}
        >
          {f.label}
          <span className="text-[10px] sm:text-xs opacity-70">({counts[f.value]})</span>
        </button>
      ))}
    </div>
  )
}
