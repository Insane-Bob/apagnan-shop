FROM nginx:1.27

#build args
ARG confFile
COPY ./nginx/${confFile} /etc/nginx/conf.d/default.conf

COPY ./ssl /etc/nginx/ssl

RUN ln -s /etc/nginx/sites-available /etc/nginx/sites-enabled

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

