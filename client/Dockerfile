FROM node:alpine AS builder

WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
