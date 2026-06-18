'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Task, Category, Priority, Filter } from '@/types'
import { supabase } from '@/lib/supabase'
import { generateId } from '@/lib/utils'
import { markDayCompleted } from '@/lib/streak'

// Mapeia o snake_case do banco para camelCase do app
function fromDb(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) ?? '',
    category: row.category as Category,
    priority: row.priority as Priority,
    dueDate: row.due_date as string,
    completed: row.completed as boolean,
    createdAt: row.created_at as string,
    userId: row.user_id as string,
  }
}

function toDb(task: Partial<Task>) {
  const db: Record<string, unknown> = {}
  if (task.id !== undefined) db.id = task.id
  if (task.title !== undefined) db.title = task.title
  if (task.description) db.description = task.description
  if (task.category !== undefined) db.category = task.category
  if (task.priority !== undefined) db.priority = task.priority
  if (task.dueDate !== undefined) db.due_date = task.dueDate
  if (task.completed !== undefined) db.completed = task.completed
  if (task.createdAt !== undefined) db.created_at = task.createdAt
  if (task.userId !== undefined) db.user_id = task.userId
  return db
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Obtém o ID do usuário autenticado
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id)
      }
    })
  }, [])

  // Carrega tarefas do Supabase filtrando pelo usuário logado
  useEffect(() => {
    if (!userId) return

    async function fetchTasks() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        setError('Erro ao carregar tarefas: ' + error.message)
      } else {
        setTasks((data ?? []).map(fromDb))
      }
      setLoaded(true)
    }
    fetchTasks()
  }, [userId])

  const addTask = useCallback(async (data: { title: string; description?: string; category: Category; priority: Priority; dueDate: string }) => {
    if (!userId) return

    const newTask: Task = {
      id: generateId(),
      title: data.title,
      description: data.description ?? '',
      category: data.category,
      priority: data.priority,
      dueDate: data.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      userId,
    }

    // Otimista: adiciona no estado imediatamente
    setTasks(prev => [newTask, ...prev])

    const { error } = await supabase.from('tasks').insert(toDb(newTask))

    if (error) {
      // Reverte em caso de erro
      setTasks(prev => prev.filter(t => t.id !== newTask.id))
      setError('Erro ao adicionar tarefa: ' + error.message)
    }
  }, [userId])

  const toggleTask = useCallback(async (id: string) => {
    if (!userId) return

    const task = tasks.find(t => t.id === id)
    if (!task) return

    const newCompleted = !task.completed

    if (newCompleted) {
      markDayCompleted()
    }

    // Otimista: atualiza estado imediatamente
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t))

    const { error } = await supabase
      .from('tasks')
      .update({ completed: newCompleted })
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      // Reverte em caso de erro
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: task.completed } : t))
      setError('Erro ao atualizar tarefa: ' + error.message)
    }
  }, [tasks, userId])

  const deleteTask = useCallback(async (id: string) => {
    if (!userId) return

    const taskBackup = tasks.find(t => t.id === id)

    // Otimista: remove do estado imediatamente
    setTasks(prev => prev.filter(t => t.id !== id))

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      // Reverte em caso de erro
      if (taskBackup) setTasks(prev => [taskBackup, ...prev])
      setError('Erro ao excluir tarefa: ' + error.message)
    }
  }, [tasks, userId])

  const updateTask = useCallback(async (id: string, data: Partial<Pick<Task, 'title' | 'description' | 'category' | 'priority' | 'dueDate'>>) => {
    if (!userId) return

    const taskBackup = tasks.find(t => t.id === id)
    if (!taskBackup) return

    const updated = { ...taskBackup, ...data }

    setTasks(prev => prev.map(t => t.id === id ? updated : t))

    const { error } = await supabase
      .from('tasks')
      .update(toDb(data as Partial<Task>))
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      setTasks(prev => prev.map(t => t.id === id ? taskBackup : t))
      setError('Erro ao editar tarefa: ' + error.message)
    }
  }, [tasks, userId])

  const todayStr = new Date().toISOString().split('T')[0]

  const filteredTasks = useCallback((filter: Filter): Task[] => {
    switch (filter) {
      case 'hoje':
        return tasks.filter(t => t.dueDate.startsWith(todayStr))
      case 'pendentes':
        return tasks.filter(t => !t.completed)
      case 'concluidas':
        return tasks.filter(t => t.completed)
      default:
        return tasks
    }
  }, [tasks, todayStr])

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    today: tasks.filter(t => t.dueDate.startsWith(todayStr)).length,
    byCategory: {
      trabalho: tasks.filter(t => t.category === 'trabalho').length,
      pessoal: tasks.filter(t => t.category === 'pessoal').length,
      estudos: tasks.filter(t => t.category === 'estudos').length,
    },
    byPriority: {
      alta: tasks.filter(t => t.priority === 'alta').length,
      media: tasks.filter(t => t.priority === 'media').length,
      baixa: tasks.filter(t => t.priority === 'baixa').length,
    },
    overdue: tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length,
  }

  return { tasks, addTask, toggleTask, updateTask, deleteTask, filteredTasks, stats, loaded, error }
}
