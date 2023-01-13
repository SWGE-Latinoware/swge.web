FROM node:14.18.1 AS builder

WORKDIR /app
COPY ./build ./build

FROM nginx:1.21
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]