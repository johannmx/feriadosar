# Build stage
FROM node:20-slim as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config if we had one, but default is fine for simple SPA if we add SPA routing.
# To support React Router (if used), we'd need a custom nginx.conf or simply replace the default.conf
RUN echo "server { \
    listen 80; \
    server_tokens off; \
    add_header X-Frame-Options \"SAMEORIGIN\"; \
    add_header X-Content-Type-Options \"nosniff\"; \
    add_header Referrer-Policy \"strict-origin-when-cross-origin\"; \
    add_header Content-Security-Policy \"default-src 'self'; script-src 'self' 'unsafe-inline' https://umami.johatech.ar; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.argentinadatos.com https://umami.johatech.ar; img-src 'self' data:;\"; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
