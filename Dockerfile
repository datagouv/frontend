FROM node:20

WORKDIR /app

COPY ./ /app

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install
RUN echo "$(date)" && \
    export $(cat /app/*.env | xargs) && \
    npm run build
    
EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]
