FROM node:20
WORKDIR /app/frontend
ENTRYPOINT ["npm","run", "dev"]