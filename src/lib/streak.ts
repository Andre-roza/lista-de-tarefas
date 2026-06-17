const STORAGE_KEY = 'talist-streak'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getStoredDates(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveDates(dates: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dates))
  } catch { }
}

export function markDayCompleted() {
  const today = getToday()
  const dates = getStoredDates()
  if (!dates.includes(today)) {
    dates.push(today)
    saveDates(dates)
  }
}

export function getStreak(): number {
  const dates = getStoredDates()
  if (dates.length === 0) return 0

  const sorted = [...dates].sort().reverse()
  const today = getToday()

  const todayIndex = sorted.indexOf(today)
  if (todayIndex === -1) return 0

  let streak = 1
  for (let i = todayIndex; i < sorted.length - 1; i++) {
    const current = new Date(sorted[i])
    const next = new Date(sorted[i + 1])
    const diff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function getMotivationalMessage(streak: number): string {
  if (streak === 0) return 'Que tal começar hoje?'
  if (streak === 1) return 'Primeiro dia! Vamos nessa!'
  if (streak === 2) return '2 dias seguidos! Continue assim!'
  if (streak === 3) return '3 dias! O hábito está se formando!'
  if (streak === 4) return '4 dias! Você está no caminho certo!'
  if (streak === 5) return '5 dias! Quase uma semana!'
  if (streak === 6) return '6 dias! Amanhã completa uma semana!'
  if (streak === 7) return 'UMA SEMANA! Parabéns!'
  if (streak <= 14) return `${streak} dias seguidos! Impressionante!`
  if (streak <= 21) return `${streak} dias! Você é uma máquina!`
  if (streak <= 30) return `${streak} dias! Disciplina invejável!`
  return `${streak} dias! Você está arrasando!`
}

export function isTodayEmpty(): boolean {
  const today = getToday()
  return !getStoredDates().includes(today)
}
