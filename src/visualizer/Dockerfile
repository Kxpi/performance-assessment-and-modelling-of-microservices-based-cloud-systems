# Fetching the latest node image on alpine linux
FROM node:alpine AS development

# Declaring env
ENV NODE_ENV development
ENV NODE_OPTIONS --openssl-legacy-provider
ENV CHOKIDAR_USEPOLLING=true

# Setting up the work directory
WORKDIR /react-app

# Installing dependencies
COPY ./package.json /react-app
RUN npm install --force

# Copying all the files in our project
COPY . .

EXPOSE 3000

# Starting our application
CMD npm start