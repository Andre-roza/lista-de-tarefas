'use client'

import { useState } from 'react'
import { ClipboardList, Loader2, AlertCircle, Flame } from 'lucide-react'
import type { Filter, Task } from '@/types'
import { useTasks } from '@/hooks/useTasks'
import TaskForm from '@/components/TaskForm'
import TaskFilters from '@/components/TaskFilters'
import TaskItem from '@/components/TaskItem'
import TaskEditModal from '@/components/TaskEditModal'
import { getStreak, getMotivationalMessage } from '@/lib/streak'

export default function TarefasPage() {
  const { addTask, toggleTask, updateTask, deleteTask, filteredTasks, loaded, error } = useTasks()
  const [filter, setFilter] = useState<Filter>('todas')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const tasks = filteredTasks(filter)
  const streak = getStreak()

  const counts = {
    todas: filteredTasks('todas').length,
    hoje: filteredTasks('hoje').length,
    pendentes: filteredTasks('pendentes').length,
    concluidas: filteredTasks('concluidas').length,
  }

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-purple-dim">
        <Loader2 size={36} className="mb-3 animate-spin text-accent opacity-70" />
        <p className="text-sm font-medium">Carregando tarefas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-purple-light">Tarefas</h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {streak > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 shadow-lg shadow-black/10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
            <Flame size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-amber-400">{streak}</span>
              <span className="text-sm font-medium text-purple-light">dias seguidos</span>
            </div>
            <p className="text-xs text-purple-muted mt-0.5">{getMotivationalMessage(streak)}</p>
          </div>
        </div>
      )}

      {streak === 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-card/50 border border-purple-border shadow-lg shadow-black/10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-border/50">
            <Flame size={20} className="text-purple-dim" />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-light">{getMotivationalMessage(0)}</p>
            <p className="text-xs text-purple-muted mt-0.5">Complete uma tarefa hoje para iniciar seu streak!</p>
          </div>
        </div>
      )}

      <TaskForm onAdd={addTask} />

      <TaskFilters current={filter} onChange={setFilter} counts={counts} />

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-purple-dim">
          <ClipboardList size={48} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {filter === 'todas' ? 'Nenhuma tarefa ainda' : 'Nenhuma tarefa encontrada'}
          </p>
          <p className="text-xs mt-1 opacity-60">
            {filter === 'todas' ? 'Clique em "Nova Tarefa" para começar' : 'Tente mudar o filtro'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={setEditingTask}
            />
          ))}
        </div>
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={updateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}
