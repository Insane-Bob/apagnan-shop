FROM node:20
WORKDIR /app/backend
RUN npm install -g sequelize-cli
ENTRYPOINT ["npm","run", "dev"]