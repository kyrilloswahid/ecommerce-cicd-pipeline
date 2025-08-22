# Stage 1: Build
FROM node:20-alpine AS build
# set working dir
WORKDIR /app
# install dependencies
COPY package*.json ./
RUN npm ci
# copy src code
COPY . .
# run for ts and js
RUN npm run build


# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app
# only copy compiled js = package files
COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist
# expose to port
EXPOSE 3000
# start the app
CMD ["node", "dist/app.js"]
