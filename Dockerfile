# Usar la imagen de Node ligera
FROM node:20-alpine

# Crear el directorio de la aplicación
WORKDIR /usr/src/app

# Instalar Nmap y TShark (Wireshark) en el entorno Alpine
RUN apk update && apk add --no-cache nmap tshark

# Copiar configuración de paquetes e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Variables de entorno (se alimentarán externamente, pero el archivo requiere el formato base)
ENV DB_PATH=/data/memory.db

# Iniciar la aplicación en modo producción
CMD [ "npm", "run", "start" ]
