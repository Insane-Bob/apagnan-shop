FROM nginx:1.27

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN ln -s /etc/nginx/sites-available /etc/nginx/sites-enabled

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

