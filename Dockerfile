FROM nginx:stable-alpine as production-stage
COPY docker/default.conf /etc/nginx/nginx.conf
COPY /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
