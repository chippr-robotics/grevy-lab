# ── Stage 1: Build ────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --prefer-offline --no-audit --no-fund
COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx config that listens on 80
RUN rm -f /etc/nginx/conf.d/default.conf.bak

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
