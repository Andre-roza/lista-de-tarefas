'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardCheck, Loader2, AlertCircle, ArrowRight, CheckCircle2, Zap, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signingUp, setSigningUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/tarefas')
    })
  }, [router])

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
    setGoogleLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (showForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        })
        if (error) {
          setError(error.message)
        } else {
          setForgotSent(true)
        }
        setLoading(false)
        return
      }

      const authFn = signingUp
        ? supabase.auth.signUp({ email, password })
        : supabase.auth.signInWithPassword({ email, password })

      const { error, data } = await authFn

      if (error) {
        setError(error.message)
      } else if (signingUp) {
        if (data.user?.identities?.length === 0) {
          setError('Este email já está cadastrado. Faça login.')
        } else {
          setSigningUp(false)
          setShowForgot(false)
          setError('Conta criada! Verifique seu email para confirmar.')
        }
      } else {
        router.push('/tarefas')
        router.refresh()
      }
    } catch {
      setError('Ocorreu um erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSigningUp(false)
    setShowForgot(false)
    setForgotSent(false)
    setError(null)
    setEmail('')
    setPassword('')
  }

  const features = [
    { icon: Zap, text: 'Organize suas tarefas com rapidez' },
    { icon: CheckCircle2, text: 'Acompanhe seu progresso diário' },
    { icon: Shield, text: 'Seguro e sincronizado na nuvem' },
  ]

  return (
    <div className="fixed inset-0 flex" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(1.03); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-16px); } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(124,58,237,0.15); } 50% { box-shadow: 0 0 40px rgba(124,58,237,0.35); } }
        @keyframes shimmerBg { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .anim-s-up { animation: slideUp 0.5s ease-out both; }
        .anim-float { animation: float 6s ease-in-out infinite; }
        .anim-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
        .shimmer-text { background: linear-gradient(90deg, #a78bfa, #818cf8, #c4b5fd, #a78bfa); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmerBg 3s linear infinite; }
        .glass-card { background: rgba(18, 18, 42, 0.6); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(42, 42, 74, 0.5); }
        .glass-light { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.06); }
        .input-glow:focus-within { box-shadow: 0 0 0 1px rgba(124,58,237,0.5), 0 0 20px rgba(124,58,237,0.15); }
      `}</style>

      {/* Lado Esquerdo - Branding */}
      <div className="hidden lg:flex relative w-1/2 bg-gradient-to-br from-[#0B0B1A] via-[#1a0a3e] to-[#0f0f2e] items-center justify-center overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent-from/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 -right-10 w-96 h-96 bg-blue-600/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-accent-from/5 to-transparent rounded-full" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Círculos orbitais decorativos */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-accent-from/10 rounded-full anim-float" />
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-accent-from/15 rounded-full anim-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-accent-from/30 rounded-full animate-pulse" style={{ animationDelay: '-1s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '-2s' }} />

        {/* Glassmorphism decorative cards */}
        <div className="absolute top-20 right-16 w-48 h-32 rounded-2xl glass-light rotate-12 anim-float" style={{ animationDelay: '-2s' }}>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-purple-400" />
            </div>
            <div className="h-2 w-full rounded bg-white/5 mb-2" />
            <div className="h-2 w-3/4 rounded bg-white/5 mb-2" />
            <div className="h-2 w-1/2 rounded bg-white/5" />
          </div>
        </div>

        <div className="absolute bottom-32 left-16 w-40 h-28 rounded-2xl glass-light -rotate-6 anim-float" style={{ animationDelay: '-4s' }}>
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-2 h-2 rounded-full bg-accent-from" />
              <span className="text-[10px] text-white/30">Progresso</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5 mb-1.5 overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-accent-from to-accent-to" />
            </div>
            <div className="text-[10px] text-white/20">75% concluído</div>
          </div>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 text-center px-12 anim-s-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-from to-accent-to shadow-2xl shadow-accent/40 mb-8 anim-pulse-glow">
            <ClipboardCheck size={44} className="text-white" />
          </div>
          <h1 className="text-6xl font-black tracking-tight mb-3">
            <span className="shimmer-text">TaList</span>
          </h1>
          <p className="text-lg text-white/40 font-light mb-10 max-w-md mx-auto leading-relaxed">
            Sua plataforma inteligente de gerenciamento de tarefas. Produtividade que se adapta a você.
          </p>

          <div className="space-y-4 inline-block text-left">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="flex items-center gap-3 text-white/30" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5">
                    <Icon size={14} className="text-accent-light" />
                  </div>
                  <span className="text-sm">{f.text}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-white/15 text-xs">
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-green-400/50" /> Online</span>
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-accent-from/50" /> Criptografado</span>
            <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-400/50" /> Sincronizado</span>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-purple-deep">
        <div className="w-full max-w-sm anim-s-up" style={{ animationDelay: '0.15s' }}>
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-from to-accent-to shadow-lg shadow-accent/30 mb-3">
              <ClipboardCheck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-purple-light">TaList</h1>
            <p className="text-purple-muted text-sm mt-1">
              {showForgot ? 'Recupere sua senha' : signingUp ? 'Crie sua conta' : 'Faça seu login'}
            </p>
          </div>

          <div className="hidden lg:block text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-light">
              {showForgot ? 'Recuperar senha' : signingUp ? 'Criar conta' : 'Bem-vindo de volta'}
            </h2>
            <p className="text-purple-muted text-sm mt-1.5">
              {showForgot ? 'Enviaremos um link para seu email' : signingUp ? 'Preencha os dados para começar' : 'Entre com seus dados para continuar'}
            </p>
          </div>

          {forgotSent ? (
            <div className="text-center py-8 anim-s-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-purple-light mb-2">Email enviado!</h3>
              <p className="text-sm text-purple-muted mb-6">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
              <button onClick={resetForm} className="text-sm text-accent-light hover:text-accent transition-colors cursor-pointer">
                Voltar para o login
              </button>
            </div>
          ) : (
            <>
              {/* Botão Google */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="glass-card w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-purple-light hover:bg-white/5 transition-all duration-200 cursor-pointer disabled:opacity-50 group mb-4"
              >
                {googleLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {googleLoading ? 'Entrando com Google...' : 'Entrar com o Google'}
              </button>

              {/* Divisor */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-purple-border" />
                <span className="text-xs text-purple-dim">ou continue com email</span>
                <div className="flex-1 h-px bg-purple-border" />
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 p-3 rounded-xl text-sm mb-4 border anim-s-up"
                  style={{
                    backgroundColor: error.includes('criada') || error.includes('email') ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                    borderColor: error.includes('criada') || error.includes('email') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                    color: error.includes('criada') || error.includes('email') ? '#22c55e' : '#ef4444',
                  }}
                >
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="anim-s-up" style={{ animationDelay: '0.2s' }}>
                  <label htmlFor="email" className="block text-sm font-medium text-purple-muted mb-1.5">
                    Email
                  </label>
                  <div className="relative input-glow rounded-xl transition-all duration-200">
                    <input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoFocus={!showForgot}
                      className="w-full px-4 py-3 rounded-xl bg-purple-card/60 border border-purple-border text-sm text-purple-light placeholder:text-purple-dim/40
                        focus:outline-none focus:border-accent/50 transition-all duration-200"
                    />
                  </div>
                </div>

                {!showForgot && (
                  <div className="anim-s-up" style={{ animationDelay: '0.25s' }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="password" className="text-sm font-medium text-purple-muted">
                        Senha
                      </label>
                      {!signingUp && (
                        <button
                          type="button"
                          onClick={() => { setShowForgot(true); setError(null) }}
                          className="text-xs text-accent-light hover:text-accent transition-colors cursor-pointer"
                        >
                          Esqueci minha senha
                        </button>
                      )}
                    </div>
                    <div className="relative input-glow rounded-xl transition-all duration-200">
                      <input
                        id="password"
                        type="password"
                        placeholder={signingUp ? 'Mínimo 6 caracteres' : 'Sua senha'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 rounded-xl bg-purple-card/60 border border-purple-border text-sm text-purple-light placeholder:text-purple-dim/40
                          focus:outline-none focus:border-accent/50 transition-all duration-200"
                      />
                    </div>
                  </div>
                )}

                <div className="anim-s-up" style={{ animationDelay: '0.3s' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-3 rounded-xl bg-gradient-to-r from-accent-from to-accent-to text-white text-sm font-semibold
                      shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98]
                      transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      )}
                      {loading
                        ? showForgot ? 'Enviando...' : signingUp ? 'Criando conta...' : 'Entrando...'
                        : showForgot ? 'Enviar link' : signingUp ? 'Criar Conta' : 'Entrar'
                      }
                    </span>
                  </button>
                </div>
              </form>

              {/* Toggle login/cadastro */}
              <div className="mt-6 text-center anim-s-up" style={{ animationDelay: '0.35s' }}>
                <button
                  type="button"
                  onClick={() => { setSigningUp(!signingUp); setShowForgot(false); setError(null); setEmail(''); setPassword('') }}
                  className="text-sm text-purple-muted hover:text-purple-light transition-colors cursor-pointer"
                >
                  {signingUp ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
                  <span className="text-accent-light hover:text-accent font-medium">
                    {signingUp ? 'Faça login' : 'Cadastre-se'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}