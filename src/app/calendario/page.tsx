'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { CATEGORIES, CATEGORY_COLORS } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'
import type { Task } from '@/types'
import CategoryTag from '@/components/CategoryTag'
import PriorityTag from '@/components/PriorityTag'
import Button from '@/components/ui/Button'

export default function CalendarioPage() {
  const { tasks, toggleTask, deleteTask } = useTasks()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const prevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null) }
  const nextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null) }

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {}
    tasks.forEach(task => {
      const key = task.dueDate.split('T')[0]
      if (!map[key]) map[key] = []
      map[key].push(task)
    })
    return map
  }, [tasks])

  const monthTasks = useMemo(() => {
    return tasks.filter(task => {
      const d = new Date(task.dueDate)
      return d.getMonth() === month && d.getFullYear() === year
    })
  }, [tasks, month, year])

  const monthStats = useMemo(() => ({
    total: monthTasks.length,
    pending: monthTasks.filter(t => !t.completed).length,
    completed: monthTasks.filter(t => t.completed).length,
  }), [monthTasks])

  const days = useMemo(() => {
    const result: {
      day: number
      tasks: Task[]
      isToday: boolean
      hasOverdue: boolean
      dateStr: string
    }[] = []

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dayTasks = tasksByDate[dateStr] || []
      result.push({
        day: d,
        tasks: dayTasks,
        isToday: dateStr === todayStr,
        hasOverdue: dayTasks.some(t => !t.completed && new Date(t.dueDate) < new Date()),
        dateStr,
      })
    }
    return result
  }, [daysInMonth, year, month, tasksByDate, todayStr])

  const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null

  const selectedTasks = selectedDateStr ? tasksByDate[selectedDateStr] || [] : []

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-purple-light">Calendário</h1>

      <div className="rounded-2xl bg-purple-card border border-purple-border shadow-xl shadow-black/10 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-purple-border">
          <Button onClick={prevMonth}>
            <ChevronLeft size={18} />
          </Button>
          <span className="text-sm font-semibold capitalize text-purple-light">{monthName}</span>
          <Button onClick={nextMonth}>
            <ChevronRight size={18} />
          </Button>
        </div>

        <div className="grid grid-cols-7">
          {dayHeaders.map(h => (
            <div key={h} className="p-2 text-center text-xs font-medium text-purple-dim bg-purple-deep/50">
              {h}
            </div>
          ))}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] p-1.5 border-b border-r border-purple-border/50" />
          ))}
          {days.map(d => (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day === selectedDay ? null : d.day)}
              className={cn(
                'min-h-[100px] p-2 border-b border-r border-purple-border/50 transition-all text-left cursor-pointer',
                d.isToday && 'bg-accent/5',
                selectedDay === d.day && 'ring-2 ring-accent/60 ring-inset',
                d.hasOverdue && !d.isToday && 'bg-red-500/5'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium',
                  d.isToday
                    ? 'bg-gradient-to-r from-accent-from to-accent-to text-white shadow-md shadow-accent/30'
                    : d.hasOverdue
                      ? 'text-red-400'
                      : 'text-purple-muted'
                )}>
                  {d.day}
                </span>
                {d.hasOverdue && (
                  <AlertCircle size={12} className="text-red-400" />
                )}
              </div>
              <div className="space-y-1">
                {d.tasks.slice(0, 2).map(task => (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] truncate shadow-sm',
                      task.completed ? 'opacity-50 line-through' : 'text-white'
                    )}
                    style={{ backgroundColor: CATEGORY_COLORS[task.category] }}
                  >
                    {task.title}
                  </div>
                ))}
                {d.tasks.length > 2 && (
                  <span className="text-[10px] text-purple-dim pl-1">+{d.tasks.length - 2} mais</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-card/50 border border-purple-border">
        <div className="flex items-center gap-1.5 text-xs text-purple-muted">
          <CalendarDays size={14} className="text-accent" />
          <span className="font-medium text-purple-light">{monthTasks.length}</span> total
        </div>
        <div className="flex items-center gap-1.5 text-xs text-purple-muted">
          <CheckCircle2 size={14} className="text-green-400" />
          <span className="font-medium text-green-400">{monthStats.completed}</span> concluídas
        </div>
        <div className="flex items-center gap-1.5 text-xs text-purple-muted">
          <Clock size={14} className="text-amber-400" />
          <span className="font-medium text-amber-400">{monthStats.pending}</span> pendentes
        </div>
      </div>

      {selectedDay && (
        <div className="rounded-2xl bg-purple-card border border-purple-border shadow-lg shadow-black/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-purple-light">
              Tarefas de {selectedDay} de {currentDate.toLocaleDateString('pt-BR', { month: 'long' })}
            </h2>
            <span className="text-xs text-purple-dim">{selectedTasks.length} tarefa(s)</span>
          </div>
          {selectedTasks.length === 0 ? (
            <p className="text-sm text-purple-dim text-center py-6">Nenhuma tarefa para este dia</p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map(task => {
                const CatIcon = CATEGORIES.find(c => c.value === task.category)?.icon
                return (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border transition-all',
                      task.completed
                        ? 'border-purple-border/50 bg-purple-deep/50 opacity-60'
                        : 'border-purple-border bg-purple-deep/30'
                    )}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer',
                        task.completed
                          ? 'bg-gradient-to-r from-accent-from to-accent-to border-accent'
                          : 'border-purple-dim hover:border-accent'
                      )}
                    >
                      {task.completed && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium truncate', task.completed && 'line-through text-purple-dim')}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <CategoryTag category={task.category} />
                        <PriorityTag priority={task.priority} />
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-purple-dim hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
