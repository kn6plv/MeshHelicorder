FROM alpine:3.12

COPY app /app/
COPY minkebox /minkebox/

RUN apk add nodejs npm ;\
    cd app ;\
    npm install

EXPOSE 7710/tcp

ENTRYPOINT cd /app ; ./Main.js
