import { Briefcase, User, BookOpen, ArrowUp, Minus, ArrowDown } from 'lucide-react'
import type { Category, Priority } from '@/types'

export const CATEGORIES: { value: Category; label: string; color: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { value: 'trabalho', label: 'TRABALHO', color: '#7C3AED', icon: Briefcase },
  { value: 'pessoal', label: 'PESSOAL', color: '#3B82F6', icon: User },
  { value: 'estudos', label: 'ESTUDOS', color: '#8B5CF6', icon: BookOpen },
]

export const PRIORITIES: { value: Priority; label: string; color: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { value: 'alta', label: 'ALTA', color: '#EF4444', icon: ArrowUp },
  { value: 'media', label: 'MÉDIA', color: '#F59E0B', icon: Minus },
  { value: 'baixa', label: 'BAIXA', color: '#6B7280', icon: ArrowDown },
]

export const CATEGORY_COLORS: Record<Category, string> = {
  trabalho: '#7C3AED',
  pessoal: '#3B82F6',
  estudos: '#8B5CF6',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  alta: '#EF4444',
  media: '#F59E0B',
  baixa: '#6B7280',
}
