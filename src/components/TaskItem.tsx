'use client'

import { Calendar, Trash2, Sparkles } from 'lucide-react'
import type { Task } from '@/types'
import CategoryTag from './CategoryTag'
import PriorityTag from './PriorityTag'
import { formatDate, isOverdue, cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const overdue = !task.completed && isOverdue(task.dueDate)

  return (
    <div
      className={cn(
        'group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-purple-card border border-purple-border transition-all duration-200',
        'hover:bg-purple-card-hover hover:shadow-xl hover:shadow-black/20 hover:border-accent/30',
        'shadow-lg shadow-black/10',
        task.completed && 'opacity-60'
      )}
    >
      <button
        onClick={() => {
          if (!task.completed) {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#7C3AED', '#4F46E5', '#8B5CF6', '#3B82F6'],
            })
          }
          onToggle(task.id)
        }}
        className={cn(
          'w-7 h-7 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer',
          task.completed
            ? 'bg-gradient-to-r from-accent-from to-accent-to border-accent shadow-md shadow-accent/30'
            : 'border-purple-dim hover:border-accent hover:shadow-md hover:shadow-accent/20'
        )}
      >
        {task.completed && (
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={() => onEdit(task)}
        className="flex-1 min-w-0 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <p className={cn('text-sm sm:text-sm font-medium truncate leading-5', task.completed && 'line-through text-purple-dim')}>
            {task.title}
          </p>
          {!task.completed && !overdue && (
            <Sparkles size={12} className="text-accent-light opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 flex-wrap">
          <CategoryTag category={task.category} />
          <PriorityTag priority={task.priority} />
          <span className={cn(
            'flex items-center gap-1 text-xs px-1.5 sm:px-2 py-0.5 rounded-full',
            overdue ? 'text-prio-alta bg-red-500/10 font-medium' : 'text-purple-dim bg-purple-border/30'
          )}>
            <Calendar size={10} />
            {formatDate(task.dueDate)}
          </span>
        </div>
      </button>

      <button
        onClick={() => onDelete(task.id)}
        className={cn(
          'p-2 rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0',
          'sm:opacity-0 sm:group-hover:opacity-100',
          'text-purple-dim hover:text-prio-alta hover:bg-red-500/10'
        )}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
