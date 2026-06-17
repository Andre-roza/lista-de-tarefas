'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Task, Category, Priority } from '@/types'
import Button from './ui/Button'
import Input from './ui/Input'
import Select from './ui/Select'
import { CATEGORIES, PRIORITIES } from '@/lib/constants'

interface TaskEditModalProps {
  task: Task | null
  onSave: (id: string, data: Partial<Pick<Task, 'title' | 'description' | 'category' | 'priority' | 'dueDate'>>) => void
  onClose: () => void
}

export default function TaskEditModal({ task, onSave, onClose }: TaskEditModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('trabalho')
  const [priority, setPriority] = useState<Priority>('media')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description ?? '')
      setCategory(task.category)
      setPriority(task.priority)
      setDueDate(task.dueDate.split('T')[0])
    }
  }, [task])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!task) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave(task.id, {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-purple-surface border sm:border border-purple-border shadow-2xl shadow-black/40 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-purple-border sticky top-0 bg-purple-surface z-10">
          <h2 className="text-base sm:text-lg font-bold text-purple-light">Editar Tarefa</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-purple-dim hover:text-purple-light hover:bg-purple-card transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <Input
            id="edit-title"
            label="Título"
            placeholder="O que você precisa fazer?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-description" className="text-sm font-medium text-purple-muted">
              Descrição
            </label>
            <textarea
              id="edit-description"
              placeholder="Adicione uma descrição (opcional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="px-3 py-2.5 rounded-xl border border-purple-border bg-purple-card text-sm text-purple-light resize-none
                focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent
                placeholder:text-purple-dim/50 min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Select
              id="edit-category"
              label="Categoria"
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              options={CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
            />
            <Select
              id="edit-priority"
              label="Prioridade"
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
              options={PRIORITIES.map(p => ({ value: p.value, label: p.label }))}
            />
            <Input
              id="edit-dueDate"
              label="Data"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} size="lg" className="flex-1 sm:flex-none">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="lg" className="flex-1 sm:flex-none">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
