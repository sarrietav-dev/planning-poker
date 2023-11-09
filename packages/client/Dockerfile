
FROM node:18.13.0-alpine3.17 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the Angular app
RUN npm run build

# Use nginx as the web server
FROM nginx:alpine

# Copy the built Angular app to the nginx web server directory
COPY --from=build /app/dist/pragma-poker /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start the nginx web server
CMD ["nginx", "-g", "daemon off;"]
