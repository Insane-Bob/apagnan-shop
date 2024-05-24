FROM node:20
WORKDIR /app/backend
ENTRYPOINT ["npm","run", "dev"]