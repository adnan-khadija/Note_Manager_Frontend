# Étape 1 : Builder Next.js
FROM node:20-alpine AS builder

# Dossier de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour les dépendances
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Installer les dépendances
RUN npm install



# Copier tout le reste du projet
COPY . .


# Construire l'application
RUN npm run build

# Étape 2 : Image finale propre
FROM node:20-alpine

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour exécuter l'application
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --omit=dev

# Copier les fichiers compilés depuis l'étape builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./

# Exposer le port de production
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
