# TaList — Lista de Tarefas

Aplicativo moderno de gerenciamento de tarefas com tema escuro, desenvolvido com **Next.js 16** (App Router), **Supabase** (Auth + Database) e **Tailwind CSS 4.1**.

## Funcionalidades

### Autenticação
- Login com **email + senha** (Supabase Auth)
- Cadastro de nova conta (mínimo 6 caracteres)
- **Login com Google** (OAuth com callback)
- Recuperação de senha
- Redirecionamento automático para `/login` se não autenticado

### Gerenciamento de Tarefas (CRUD)
- **Criar**: formulário expansível com título, categoria, prioridade e data
- **Listar**: cards com checkbox circular, título, tags, data de vencimento
- **Editar**: modal com overlay e backdrop-blur, suporta tecla ESC para fechar
- **Excluir**: botão lixeira visível ao passar o mouse
- **Concluir**: toggle com animação de **confete** (roxo/azul)

### Filtros
Barra com 4 abas e contagem numérica:
| Filtro | Descrição |
|---|---|
| Todas | Exibe todas as tarefas |
| Hoje | Tarefas com data igual à atual |
| Pendentes | Tarefas não concluídas |
| Concluídas | Tarefas finalizadas |

### Categorias
| Categoria | Cor | Ícone |
|---|---|---|
| Trabalho | `#7C3AED` (roxo) | Briefcase |
| Pessoal | `#3B82F6` (azul) | User |
| Estudos | `#8B5CF6` (roxo claro) | BookOpen |

### Prioridades
| Prioridade | Cor | Ícone |
|---|---|---|
| Alta | `#EF4444` (vermelho) | ArrowUp |
| Média | `#F59E0B` (âmbar) | Minus |
| Baixa | `#6B7280` (cinza) | ArrowDown |

### Streak (Dias Consecutivos)
- Rastreio automático de dias seguidos com tarefas concluídas
- Armazenamento em **localStorage** (chave `talist-streak`)
- Mensagens motivacionais progressivas (0 a 30+ dias)
- Exibição com gradiente amarelo/laranja e ícone de chama

### Dashboard de Análises (`/analises`)
- **4 cards de resumo**: Total, Concluídas, Pendentes, Atrasadas
- **Gráfico de barras semanal** (Seg a Dom) com tarefas completadas por dia
- **Distribuição por categoria** (Trabalho, Pessoal, Estudos) com percentual
- **Distribuição por prioridade** (Alta, Média, Baixa) com percentual
- Taxa de conclusão semanal e destaque no dia atual

### Calendário (`/calendario`)
- Calendário mensal completo com navegação entre meses
- Dias com tarefas exibem até 2 mini-cards coloridos por categoria
- Indicador de tarefas atrasadas (ícone de alerta vermelho)
- Dia atual destacado com círculo gradiente roxo
- Legenda com total, concluídas e pendentes do mês
- Ao clicar em um dia: painel inferior com lista de tarefas e ações

---

## Tech Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 | Framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | 5.7 | Tipagem |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1 | Estilização |
| [Supabase](https://supabase.com/) | ^2.108 | Banco de dados + Autenticação |
| [lucide-react](https://lucide.dev/) | ^0.510 | Ícones |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | ^1.9 | Animação de confete |
| ESLint | 9 | Linter |

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx                  # Layout raiz com Navbar
│   ├── page.tsx                    # Home → redireciona para /tarefas
│   ├── globals.css                 # Tema escuro + estilos globais
│   ├── tarefas/page.tsx            # Página principal (CRUD + streak)
│   ├── analises/page.tsx           # Dashboard de métricas
│   ├── calendario/page.tsx         # Calendário mensal
│   ├── login/page.tsx              # Autenticação (login/cadastro)
│   └── auth/callback/route.ts      # Callback OAuth do Supabase
├── components/
│   ├── Navbar.tsx                  # Navegação com links + logout
│   ├── TaskItem.tsx                # Card individual de tarefa
│   ├── TaskForm.tsx                # Formulário de criação
│   ├── TaskFilters.tsx             # Barra de filtros
│   ├── TaskEditModal.tsx           # Modal de edição
│   ├── CategoryTag.tsx             # Tag visual de categoria
│   ├── PriorityTag.tsx             # Tag visual de prioridade
│   └── ui/
│       ├── Button.tsx              # Botão reutilizável
│       ├── Input.tsx               # Campo de texto reutilizável
│       └── Select.tsx              # Select reutilizável
├── hooks/
│   └── useTasks.ts                 # Hook central de estado + CRUD
├── lib/
│   ├── supabase.ts                 # Cliente Supabase
│   ├── streak.ts                   # Lógica de streak (localStorage)
│   ├── constants.ts                # Definições de categorias e prioridades
│   └── utils.ts                    # Utilitários (cn, formatDate, isOverdue)
└── types/
    └── index.ts                    # Tipos: Task, Priority, Category, Filter
```

---

## Tema e Design

### Paleta de Cores
| Token | Cor | Uso |
|---|---|---|
| `purple-deep` | `#0B0B1A` | Fundo principal |
| `purple-surface` | `#12122A` | Superfícies (cards, navbar) |
| `purple-card` | `#1A1A35` | Cards |
| `purple-card-hover` | `#202040` | Hover dos cards |
| `purple-border` | `#2A2A4A` | Bordas |
| `purple-light` | `#E8E8F0` | Texto principal |
| `purple-muted` | `#9898B8` | Texto secundário |
| `purple-dim` | `#6B6B8D` | Texto terciário |
| `accent` | `#7C3AED` | Destaque principal |
| `accent-to` | `#4F46E5` | Gradiente secundário |

### Efeitos
- **Glassmorphism**: backdrop-filter blur, bordas semi-transparentes
- **Gradientes**: lineares em cards, botões e abas ativas
- **Animações**: fadeIn, slideUp, float, pulseGlow, shimmer
- **Hover**: elevação (shadow-xl), brilho nas bordas, escala em botões
- **Scrollbar** customizada (fina 6px, roxo escuro)
- **Responsivo**: grid adaptável, esconde elementos em mobile

---

## Como Rodar

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com/) (gratuita)

### Passos

```bash
# Clone o repositório
git clone https://github.com/Andre-roza/lista-de-tarefas.git
cd lista-de-tarefas

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

Preencha `.env.local` com suas credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Banco de Dados

Crie uma tabela `tasks` no Supabase com as colunas:

| Coluna | Tipo |
|---|---|
| `id` | `uuid` (PK, default `gen_random_uuid()`) |
| `title` | `text` (not null) |
| `description` | `text` |
| `category` | `text` (not null) |
| `priority` | `text` (not null) |
| `due_date` | `date` |
| `completed` | `boolean` (default false) |
| `created_at` | `timestamptz` (default `now()`) |
| `user_id` | `uuid` (FK para auth.users) |

Ative **Row Level Security (RLS)** com políticas para leitura/escrita apenas do próprio usuário.

---

## Fluxo do Usuário

1. Acessa `/` → redirecionado para `/tarefas`
2. Se não autenticado → redirecionado para `/login`
3. Faz login ou cadastro (email/senha ou Google)
4. Na página `/tarefas`:
   - Visualiza streak de dias consecutivos
   - Cria tarefas pelo formulário expansível
   - Alterna conclusão com confete
   - Edita tarefas no modal
   - Exclui tarefas
   - Filtra por Todas/Hoje/Pendentes/Concluídas
5. Navega para **Análises** (`/analises`) para métricas e gráficos
6. Navega para **Calendário** (`/calendario`) para visão mensal

---

## Licença

Privado — uso pessoal.
