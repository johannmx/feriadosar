# 🚀 Argentina Holidays Calendar - Premium Dashboard

Una aplicación web moderna y de alto rendimiento para visualizar los feriados nacionales en Argentina, con una interfaz intuitiva, soporte para múltiples vistas y una arquitectura optimizada para despliegue global.

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## ✨ Características Principales

- 📅 **Vista Dual Inteligente**: Alterna entre una **Vista de Lista** detallada con tarjetas informativas y una **Vista de Calendario** completa para una planificación anual eficiente.
- 🌓 **Modo Oscuro Premium**: Interfaz adaptativa que respeta la preferencia del sistema o permite selección manual, optimizada para reducir la fatiga visual.
- 📱 **Diseño Ultra-Responsivo**: Experiencia de usuario fluida y consistente en móviles, tablets y escritorio, con componentes táctiles optimizados.
- 🔄 **Sincronización en Tiempo Real**: Integración directa con la API oficial de **ArgentinaDatos** para garantizar que la información de feriados (inamovibles, trasladables y puentes) esté siempre actualizada.
- 🎨 **Estética Moderna**: Construido con **TailwindCSS** siguiendo principios de diseño limpio, con tipografías legibles y micro-interacciones fluidas.
- 🌍 **Multi-Arquitectura**: Imágenes de Docker optimizadas para **amd64** y **arm64**, permitiendo el despliegue en servidores tradicionales o dispositivos como Raspberry Pi.

## 🏗️ Arquitectura

- **Frontend**: React 19 + Vite (Ecosistema moderno y ultrarrápido).
- **Styling**: TailwindCSS (Utility-first CSS para máxima consistencia visual).
- **Icons**: Lucide React (Set de iconos minimalista y consistente).
- **Deployment**: Nginx (Servidor de alto rendimiento para contenido estático).
- **CI/CD**: GitHub Actions para builds automatizados y publicación en GHCR.

## 🚀 Cómo Empezar

### Requisitos Previos
- Node.js 20+ (para desarrollo local)
- Docker y Docker Compose (para despliegue simplificado)

### Despliegue Rápido (Producción)
Si quieres levantarlo usando las imágenes ya compiladas en GitHub Container Registry:

1. Clona el repositorio.
2. Ejecuta:
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```
   La aplicación estará disponible en `http://localhost`.

### Desarrollo Local
Para trabajar en el código base y ver los cambios en tiempo real:

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`.

## 📦 Infraestructura y Docker
El proyecto está diseñado para ser agnóstico a la infraestructura gracias a Docker. Puedes encontrar las configuraciones en:
- `Dockerfile`: Construcción multi-etapa (Build & Serve).
- `docker-compose.yml`: Configuración para desarrollo local.
- `docker-compose.prod.yml`: Configuración optimizada para producción.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---
Hecho con ✨ por **Johann** y **Antigravity**.
