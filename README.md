# ActaSync - Sistema de Gerenciamento de Atas

ActaSync é uma aplicação web moderna para gerenciamento de reuniões e atas, desenvolvida com React, TypeScript e Supabase.

## Funcionalidades

### ✅ Implementadas
- **Autenticação**: Sistema completo de login e registro
- **Dashboard**: Visão geral com estatísticas e ações rápidas
- **Gerenciamento de Reuniões**: Listagem e visualização de reuniões
- **Interface Responsiva**: Design moderno e adaptável

### 🚧 Em Desenvolvimento
- **Criação/Edição de Reuniões**: Formulários para gerenciar reuniões
- **Sistema de Atas**: Criação e edição de atas de reunião
- **Templates**: Sistema de templates para atas
- **Participantes**: Gerenciamento de participantes das reuniões
- **Notificações**: Sistema de notificações e lembretes
- **Relatórios**: Geração de relatórios e exportação

## Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React
- **Datas**: date-fns
- **Build**: Vite

## Configuração do Projeto

### Pré-requisitos
- Node.js 18+
- Conta no Supabase

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd actasync
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

5. Configure o banco de dados no Supabase (veja seção abaixo)

6. Execute o projeto:
```bash
npm run dev
```

## Configuração do Banco de Dados

Para configurar o banco de dados no Supabase, você precisará:

1. Criar um novo projeto no Supabase
2. Executar as migrações SQL para criar as tabelas necessárias
3. Configurar as políticas de Row Level Security (RLS)

### Estrutura do Banco

O sistema utiliza as seguintes tabelas principais:
- `users` - Perfis dos usuários
- `meetings` - Reuniões agendadas
- `meeting_participants` - Participantes das reuniões
- `agendas` - Itens da pauta das reuniões
- `minutes` - Atas das reuniões
- `action_items` - Itens de ação das atas
- `templates` - Templates para atas
- `notifications` - Notificações do sistema

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Auth/           # Componentes de autenticação
│   ├── Dashboard/      # Dashboard principal
│   ├── Layout/         # Layout e navegação
│   └── Meetings/       # Componentes de reuniões
├── contexts/           # Contextos React
├── lib/               # Configurações e utilitários
├── types/             # Definições de tipos TypeScript
└── App.tsx            # Componente principal
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linting do código

## Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Suporte

Para suporte e dúvidas, abra uma issue no repositório do projeto.