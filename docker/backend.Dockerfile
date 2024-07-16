FROM node:20
WORKDIR /app/backend
RUN npm install -g sequelize-cli
COPY backend.entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

