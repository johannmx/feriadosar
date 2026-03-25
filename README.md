# Feriados AR

Calendario anual de feriados en Argentina. Una aplicación web moderna y rápida para visualizar los feriados nacionales (inamovibles, trasladables, puentes) en formato de lista y calendario interactivo.

## Características
- **Vista de Lista:** Tarjetas detalladas con información de cada feriado.
- **Vista de Calendario:** Calendario visual interactivo de todo el año.
- **Modo Oscuro/Claro:** Soporte nativo y selección manual.
- **Diseño Responsivo:** Adaptado completamente a dispositivos móviles.

## Tecnologías Usadas
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (Iconos)

## API de Datos
Los datos sobre los feriados son obtenidos dinámicamente utilizando la API pública de [ArgentinaDatos](https://argentinadatos.com/).

## Cómo Levantar el Proyecto

### Opción 1: Desarrollo Local (Node.js)
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/feriadosar.git
   cd feriadosar
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Opción 2: Docker Compose (Desarrollo/Local)
Este proyecto incluye soporte para ser levantado de manera sencilla utilizando Docker, soportando arquitecturas AMD64 y ARM64.

1. Clonar el repositorio y acceder a la carpeta:
   ```bash
   git clone https://github.com/tu-usuario/feriadosar.git
   cd feriadosar
   ```
2. Levantar el contenedor:
   ```bash
   docker-compose up -d
   ```
3. El proyecto estará disponible en `http://localhost:8080`.

### Opción 3: Docker Compose (Producción)
Para entornos de producción, se recomienda usar el archivo específico que utiliza las imágenes pre-construidas:

```bash
docker-compose -f docker-compose.prod.yml up -d
```
Esto levantará la aplicación en el puerto `80` (ajustable en el archivo `.yml`).


### Construcción Manual para Producción
Para construir la versión optimizada:
```bash
npm run build
```
Luego puedes servir la carpeta `dist/` con cualquier servidor estático o Docker.

## Licencia
Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para detalles.
