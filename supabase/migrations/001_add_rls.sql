-- Adiciona coluna user_id vinculada ao auth.users
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Index para consultas por usuário
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Habilita Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Remove policies existentes (caso existam) para evitar conflito
DROP POLICY IF EXISTS "Usuários podem ver apenas suas próprias tarefas" ON tasks;
DROP POLICY IF EXISTS "Usuários podem criar suas próprias tarefas" ON tasks;
DROP POLICY IF EXISTS "Usuários podem editar apenas suas próprias tarefas" ON tasks;
DROP POLICY IF EXISTS "Usuários podem excluir apenas suas próprias tarefas" ON tasks;

-- Policy: SELECT - cada usuário vê apenas suas tarefas
CREATE POLICY "Usuários podem ver apenas suas próprias tarefas" ON tasks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: INSERT - cada usuário cria tarefas com seu próprio user_id
CREATE POLICY "Usuários podem criar suas próprias tarefas" ON tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: UPDATE - cada usuário edita apenas suas tarefas
CREATE POLICY "Usuários podem editar apenas suas próprias tarefas" ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: DELETE - cada usuário exclui apenas suas tarefas
CREATE POLICY "Usuários podem excluir apenas suas próprias tarefas" ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);
