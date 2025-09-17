# ReelVault MVP 2.0

ReelVault é um MVP de uma plataforma para explorar, favoritar e comentar filmes, com interface moderna e responsiva.

## Descrição

Este projeto é um MVP (Produto Mínimo Viável) de uma aplicação web para catálogo de filmes, permitindo aos usuários visualizar detalhes, favoritar e comentar sobre filmes. Utiliza Next.js, React, TailwindCSS e integrações modernas para UI.

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/alunofranciscocunha/mvp_reelvault_2.0_FrontEnd.git
   cd mvp_reelvault_2.0_FrontEnd
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Obtenha sua API Key do TMDB:**
   - Acesse [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) e faça login ou crie uma conta.
   - Clique em "Create" para gerar uma nova API Key (v4 auth token).
   - Copie o token de autenticação v4 (Bearer Token).
   - Se precisar de um passo a passo, veja este tutorial: [Como obter sua API Key do TMDB](https://www.educative.io/courses/movie-database-api-python/set-up-the-credentials)

4. **Configure o arquivo `.env`:**
   - Renomeie o arquivo `.env.example` para `.env` na raiz do projeto.
   - Abra o `.env` e adicione a seguinte linha, substituindo `SUA_API_KEY_AQUI` pelo token copiado:
     ```
     NEXT_PUBLIC_TMDB_TOKEN="SUA_API_KEY_AQUI"
     ```

## Execução

### Modo desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

### Build para produção
```bash
npm run build
npm start
# ou
yarn build
yarn start
```

### Rodando com Docker
1. Certifique-se de que o arquivo `.env` está presente na raiz do projeto (ele será copiado para dentro do container).
2. Para buildar e rodar o container:
   ```bash
   docker build -t reelvault-frontend .
   docker run --env-file .env -p 3000:3000 reelvault-frontend
   ```
   - O parâmetro `--env-file .env` garante que as variáveis do seu `.env` local sejam usadas no container.
   - A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

### Rodando com Docker Compose
1. Certifique-se de que o arquivo `.env` está presente na raiz do projeto.
2. Execute:
   ```bash
   docker compose up --build
   ```
   - O Docker Compose já lê automaticamente o `.env` da raiz.
   - Para rodar em segundo plano: `docker compose up -d --build`

> **Dicas e Observações:**
> - Sempre garanta que o `.env` está correto antes de rodar o build Docker.
> - Se alterar o `.env`, rode o build novamente para atualizar as variáveis no container.
> - O login é obrigatório para favoritar ou comentar filmes.
> - Para rodar em produção, utilize as variáveis de ambiente corretas e garanta que a porta 3000 esteja liberada.
> - Se for rodar o backend localmente, ajuste as URLs das APIs se necessário.

## Estrutura de Pastas

```
reelvault_2.0_mpv/
└── Front-End/
    ├── public/                # Arquivos estáticos (imagens, ícones, etc)
    │   └── icons/
    ├── src/
    │   ├── _components/       # Componentes reutilizáveis
    │   │   └── ui/            # Componentes de UI (botão, input, etc)
    │   ├── _lib/              # Funções utilitárias e helpers
    │   ├── api/               # Integração com APIs externas
    │   └── app/               # Páginas e layouts do Next.js
    │       ├── movies/        # Páginas relacionadas a filmes
    │       ├── favorites/     # Página de favoritos
    │       └── ...
    ├── .env.example           # Exemplo de variáveis de ambiente
    ├── docker-compose.yml     # Configuração Docker Compose
    ├── Dockerfile             # Dockerfile do projeto
    ├── package.json
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── README.md
```

## Link do Figma

[Protótipo no Figma](https://www.figma.com/design/xfikLj3249DjmJLLdRFaLo/ReelVault?node-id=1-2&t=ipkcQINSOOq0cqBP-1)

---