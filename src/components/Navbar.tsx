'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ListTodo, BarChart3, Calendar, LogOut, ClipboardCheck, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

const links = [
  { href: '/tarefas', label: 'Tarefas', icon: ListTodo },
  { href: '/analises', label: 'Análises', icon: BarChart3 },
  { href: '/calendario', label: 'Calendário', icon: Calendar },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  if (pathname === '/login') return null

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-purple-surface/80 backdrop-blur-lg border-b border-purple-border fixed top-0 left-0 right-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/tarefas" className="flex items-center gap-2 mr-6 text-purple-light hover:text-white transition-colors">
          <ClipboardCheck size={24} className="text-accent-from" />
          <span className="text-lg font-bold tracking-tight">TaList</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(link => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-accent-from to-accent-to text-white shadow-lg shadow-accent/25'
                    : 'text-purple-muted hover:text-purple-light hover:bg-purple-card'
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            )
          })}
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-purple-muted hover:text-purple-light hover:bg-purple-card transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          {loggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
          Sair
        </button>
      </div>
    </header>
  )
}
