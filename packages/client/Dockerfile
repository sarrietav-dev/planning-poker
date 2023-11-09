FROM node:18.13.0-alpine3.17 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18.13.0-alpine3.17 AS build
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/pragma-poker /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
