# Этап 1: билд фронта
FROM node:20-alpine AS build
WORKDIR /app

# Копируем только package.json, чтобы кэшировался npm install
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Accept build argument for API URL
ARG VITE_BASE_API_URL

# Сборка только через vite (без проверки типов)
RUN CI=false npm run build-only

# Этап 2: nginx
FROM nginx:alpine

# Копируем собранный фронт
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
