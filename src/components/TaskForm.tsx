'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Category, Priority } from '@/types'
import Button from './ui/Button'
import Input from './ui/Input'
import Select from './ui/Select'
import { CATEGORIES, PRIORITIES } from '@/lib/constants'

interface TaskFormProps {
  onAdd: (data: { title: string; category: Category; priority: Priority; dueDate: string }) => void
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('trabalho')
  const [priority, setPriority] = useState<Priority>('media')
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), category, priority, dueDate })
    setTitle('')
    setCategory('trabalho')
    setPriority('media')
    setDueDate(new Date().toISOString().split('T')[0])
    setOpen(false)
  }

  if (!open) {
    return (
      <Button variant="primary" onClick={() => setOpen(true)} size="lg" className="w-full">
        <Plus size={20} />
        Nova Tarefa
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-2xl bg-purple-card border border-purple-border shadow-xl shadow-black/10 space-y-3 sm:space-y-4">
      <Input
        id="title"
        placeholder="O que você precisa fazer?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
      />
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Select
          id="category"
          label="Categoria"
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
          options={CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
        />
        <Select
          id="priority"
          label="Prioridade"
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
          options={PRIORITIES.map(p => ({ value: p.value, label: p.label }))}
        />
        <Input
          id="dueDate"
          label="Data"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)} size="lg" className="flex-1 sm:flex-none">
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="lg" className="flex-1 sm:flex-none">
          Adicionar
        </Button>
      </div>
    </form>
  )
}
