import { PRIORITIES } from '@/lib/constants'
import type { Priority } from '@/types'

export default function PriorityTag({ priority }: { priority: Priority }) {
  const prio = PRIORITIES.find(p => p.value === priority)
  if (!prio) return null
  const Icon = prio.icon
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wider text-white shadow-sm"
      style={{ backgroundColor: prio.color }}
    >
      <Icon size={10} />
      {prio.label}
    </span>
  )
}
