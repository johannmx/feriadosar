# Build stage
FROM node:24-slim as build
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
    add_header X-Frame-Options \"SAMEORIGIN\" always; \
    add_header X-Content-Type-Options \"nosniff\" always; \
    add_header Referrer-Policy \"strict-origin-when-cross-origin\" always; \
    add_header Content-Security-Policy \"default-src 'self'; script-src 'self' https://umami.johatech.ar; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.argentinadatos.com https://umami.johatech.ar; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests;\" always; \
    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always; \
    add_header Cross-Origin-Opener-Policy \"same-origin\" always; \
    add_header Cross-Origin-Resource-Policy \"same-origin\" always; \
    add_header Permissions-Policy \"geolocation=(), camera=(), microphone=()\" always; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
