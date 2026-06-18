export type Priority = 'alta' | 'media' | 'baixa'
export type Category = 'trabalho' | 'pessoal' | 'estudos'
export type Filter = 'todas' | 'hoje' | 'pendentes' | 'concluidas'

export interface Task {
  id: string
  title: string
  description: string
  category: Category
  priority: Priority
  dueDate: string
  completed: boolean
  createdAt: string
  userId: string
}
