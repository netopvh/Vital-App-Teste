# Vital

Aplicação Next.js com Shadcn UI, autenticação JWT, Prisma e MySQL.

## Pré-requisitos

- Node.js 22+
- npm
- Docker e Docker Compose (para rodar em container)

## Variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores:

```bash
cp .env.example .env
```

Edite `.env` e defina:

- **DATABASE_URL**: URL de conexão MySQL (para desenvolvimento local use `localhost`; no Docker use o serviço `mysql`).
- **JWT_SECRET**: Segredo para assinatura dos JWTs (em produção use um valor longo e aleatório).
- **AUTH_COOKIE_NAME** (opcional): Nome do cookie de autenticação (padrão: `vital_token`).

## Desenvolvimento local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Suba o MySQL (ex.: via Docker):

   ```bash
   docker compose up -d mysql
   ```

3. Aplique as migrations:

   ```bash
   npx prisma migrate deploy
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

Acesse [http://localhost:3000](http://localhost:3000).

## Rodando com Docker

Para subir a aplicação e o MySQL com Docker Compose:

```bash
docker compose up -d
```

Na primeira execução, o serviço `app` aplica as migrations automaticamente antes de iniciar o Next.js. A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000).

Para aplicar migrations manualmente (por exemplo, em outro ambiente):

```bash
docker compose run --rm app npx prisma migrate deploy
```

## Scripts

- `npm run dev` – Servidor de desenvolvimento
- `npm run build` – Build de produção
- `npm run start` – Servidor de produção
- `npm run lint` – ESLint

## Estrutura de autenticação

- **Registro**: `POST /api/auth/register` (body: `email`, `password`, `name?`).
- **Login**: `POST /api/auth/login` (body: `email`, `password`). Define cookie HttpOnly com JWT.
- **Logout**: `POST /api/auth/logout`. Remove o cookie.
- **Usuário atual**: `GET /api/auth/me`. Retorna o usuário autenticado (cookie ou header `Authorization: Bearer <token>`).

As rotas `/dashboard` e `/api/auth/me` são protegidas pelo middleware (redirecionamento para `/login` ou 401 se não autenticado).
