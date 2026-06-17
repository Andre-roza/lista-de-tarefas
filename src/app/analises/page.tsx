'use client'

import { useMemo } from 'react'
import { BarChart3, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { CATEGORIES, PRIORITIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function getWeekDays(): { label: string; dateStr: string; short: string }[] {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))

  const days: { label: string; dateStr: string; short: string }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    days.push({
      label: dayLabels[d.getDay()],
      dateStr,
      short: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
    })
  }
  return days
}

export default function AnalisesPage() {
  const { tasks, stats } = useTasks()

  const weekDays = useMemo(() => getWeekDays(), [])

  const weeklyData = useMemo(() => {
    const weekStart = weekDays[0].dateStr
    const weekEnd = weekDays[6].dateStr

    const weekTasks = tasks.filter(t => {
      const d = t.dueDate.split('T')[0]
      return d >= weekStart && d <= weekEnd
    })

    const dailyCompleted = weekDays.map(day => {
      const completed = tasks.filter(t => {
        const d = t.dueDate.split('T')[0]
        return d === day.dateStr && t.completed
      }).length
      const total = tasks.filter(t => {
        const d = t.dueDate.split('T')[0]
        return d === day.dateStr
      }).length
      return { ...day, completed, total }
    })

    const weekTotal = dailyCompleted.reduce((s, d) => s + d.total, 0)
    const weekCompleted = dailyCompleted.reduce((s, d) => s + d.completed, 0)
    const weekRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
    const maxCompleted = Math.max(...dailyCompleted.map(d => d.completed), 1)

    return { dailyCompleted, weekTotal, weekCompleted, weekRate, maxCompleted }
  }, [tasks, weekDays])

  const cards = [
    {
      label: 'Total de Tarefas',
      value: stats.total,
      icon: BarChart3,
      color: 'text-accent',
      gradient: 'from-accent-from/20 to-accent-to/20',
    },
    {
      label: 'Concluídas',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-green-400',
      gradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
      label: 'Pendentes',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-400',
      gradient: 'from-amber-500/20 to-orange-500/20',
    },
    {
      label: 'Atrasadas',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-prio-alta',
      gradient: 'from-red-500/20 to-rose-500/20',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-purple-light">Análises</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="p-4 rounded-2xl bg-purple-card border border-purple-border shadow-lg shadow-black/10">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${card.gradient}`}>
                  <Icon size={18} className={card.color} />
                </div>
                <span className="text-xs text-purple-muted font-medium">{card.label}</span>
              </div>
              <p className="text-2xl font-bold text-purple-light">{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="p-5 rounded-2xl bg-purple-card border border-purple-border shadow-lg shadow-black/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-purple-light">Produtividade Semanal</h2>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-purple-muted">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              {weeklyData.weekCompleted} concluídas
            </span>
            <span className="flex items-center gap-1 text-purple-muted">
              <TrendingUp size={14} className={cn(weeklyData.weekRate >= 50 ? 'text-green-400' : 'text-amber-400')} />
              {weeklyData.weekRate}% conclusão
            </span>
          </div>
        </div>

        <div className="flex items-end gap-2 h-40">
          {weeklyData.dailyCompleted.map(day => {
            const pct = (day.completed / weeklyData.maxCompleted) * 100
            const isToday = day.dateStr === new Date().toISOString().split('T')[0]
            return (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-medium text-purple-muted">{day.completed}</span>
                <div className="w-full flex justify-center" style={{ height: `${Math.max(pct, 4)}%` }}>
                  <div
                    className={cn(
                      'w-full max-w-[32px] rounded-t-lg transition-all duration-500',
                      isToday ? 'bg-gradient-to-t from-accent-from to-accent-to shadow-md shadow-accent/30' : 'bg-purple-border'
                    )}
                    style={{ height: '100%' }}
                  />
                </div>
                <span className={cn(
                  'text-[10px] font-medium',
                  isToday ? 'text-accent-light' : 'text-purple-dim'
                )}>{day.short}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-purple-card border border-purple-border shadow-lg shadow-black/10">
          <h2 className="text-sm font-bold text-purple-light mb-4">Por Categoria</h2>
          <div className="space-y-3">
            {CATEGORIES.map(cat => {
              const count = stats.byCategory[cat.value]
              const max = Math.max(...Object.values(stats.byCategory), 1)
              const pct = (count / max) * 100
              const Icon = cat.icon
              return (
                <div key={cat.value}>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-purple-light">
                      <Icon size={12} />
                      {cat.label}
                    </span>
                    <span className="text-purple-dim">{count}</span>
                  </div>
                  <div className="h-2.5 bg-purple-deep rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-purple-card border border-purple-border shadow-lg shadow-black/10">
          <h2 className="text-sm font-bold text-purple-light mb-4">Por Prioridade</h2>
          <div className="space-y-3">
            {PRIORITIES.map(prio => {
              const count = stats.byPriority[prio.value]
              const max = Math.max(...Object.values(stats.byPriority), 1)
              const pct = (count / max) * 100
              const Icon = prio.icon
              return (
                <div key={prio.value}>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-purple-light">
                      <Icon size={12} />
                      {prio.label}
                    </span>
                    <span className="text-purple-dim">{count}</span>
                  </div>
                  <div className="h-2.5 bg-purple-deep rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: prio.color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
