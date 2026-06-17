import { CATEGORIES } from '@/lib/constants'
import type { Category } from '@/types'

export default function CategoryTag({ category }: { category: Category }) {
  const cat = CATEGORIES.find(c => c.value === category)
  if (!cat) return null
  const Icon = cat.icon
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wider text-white shadow-sm"
      style={{ backgroundColor: cat.color }}
    >
      <Icon size={10} />
      {cat.label}
    </span>
  )
}
