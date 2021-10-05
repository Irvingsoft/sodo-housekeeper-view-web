FROM nginx:stable-alpine

COPY dist/ /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
CMD ["ls"]
CMD ["nginx", "-g", "daemon off;"]
