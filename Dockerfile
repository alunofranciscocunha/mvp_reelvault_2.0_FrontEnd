# Etapa 1 - Build
FROM node:20-slim AS builder

# Dependências para compilar binários nativos (ex: lightningcss)
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  libc++-dev \
  libc++abi-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia apenas os manifests para otimizar cache
COPY package*.json ./

# Instala todas as dependências (inclui dev porque precisamos para build)
RUN npm ci

# Copia o resto do projeto
COPY . .

# Build da aplicação Next.js
RUN npm run build


# Etapa 2 - Runtime
FROM node:20-slim AS runner

WORKDIR /app

# Copia apenas os arquivos necessários do builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./

# Instala apenas dependências de produção
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
