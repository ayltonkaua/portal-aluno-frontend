# 📱 Portal do Aluno - Frontend

Frontend React separado do Portal do Aluno que consome a API.

## Tecnologias

- **Vite** - Build tool
- **React 18** - UI library
- **TypeScript** - Tipagem
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes
- **React Router** - Navegação

## Instalação

```bash
npm install
cp .env.example .env
# Editar VITE_API_URL para apontar para a API
npm run dev
```

## Variáveis de Ambiente

```env
VITE_API_URL=https://sua-api.render.com/api/v1
```

## Páginas

| Rota | Descrição |
|------|-----------|
| `/login` | Login com token JWT |
| `/` | Dashboard com frequência |
| `/boletim` | Notas por disciplina |
| `/atestados` | Enviar/ver atestados |
| `/meus-dados` | Atualizar cadastro |
| `/carteirinha` | ID digital |

## Deploy na Vercel

1. Conecte o repositório
2. Framework preset: **Vite**
3. Adicione `VITE_API_URL` nas variáveis
4. Deploy!

## Estrutura

```
src/
├── components/
│   ├── ui/           # shadcn/ui
│   └── AttendanceRing.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── api.ts        # Cliente HTTP
│   └── utils.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   ├── BoletimPage.tsx
│   ├── AtestadosPage.tsx
│   ├── MeusDadosPage.tsx
│   └── CarterinhaPage.tsx
├── App.tsx           # Rotas
├── main.tsx
└── index.css
```

## Autenticação

O frontend espera um token JWT do Supabase. Para testar:

1. Faça login no app principal
2. Copie o token do localStorage (`sb-xxx-auth-token`)
3. Cole na tela de login do portal

## Licença

Privado - ChamadaDiária
