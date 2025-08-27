# ActaSync — PWA (React + Firebase Realtime Database)

Projeto com todas as funcionalidades inicialmente solicitadas.

## Como usar
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o Firebase em `src/config.json` (substitua os placeholders). Use o *Realtime Database* e coloque `databaseURL`.
3. Ative Authentication (Email/Senha) e Realtime Database no console do Firebase.
4. Rode o projeto:
   ```bash
   npm run dev
   ```

## Novidades nesta versão
- Autenticação com cadastro (signup) e criação de profile em Realtime DB.
- Proteção de rotas com `RequireAuth`.
- Controle de roles (campo `role` em `users/<uid>`).
- CRUD básico para Membros, Hinos, Calendário e Atas usando Realtime Database.
- `AtaForm` com autocomplete para membros e hinos.
- Geração de PDF da Ata.
- Relatório: lista de membros ordenada por data do último discurso.

## Estrutura
- `src/firebase`: configuração e contextos
- `src/components`: componentes e telas
- `src/utils`: utilitários
