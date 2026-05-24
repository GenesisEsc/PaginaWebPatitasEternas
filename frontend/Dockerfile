# Etapa 1: Construcción
# Usamos Node 22 para que coincida con tu máquina local
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
# Usamos el flag para evitar errores de dependencias de bootstrap
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --configuration=production

# Etapa 2: Servidor Nginx
FROM nginx:alpine
# Ruta correcta
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]