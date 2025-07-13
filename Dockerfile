FROM node:alpine
RUN apk add --no-cache curl bash postgresql-client
WORKDIR /app
RUN curl -o /usr/local/bin/wait-for-it https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it

COPY package.json ./
RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

ENTRYPOINT ["sh", "-c", "/usr/local/bin/wait-for-it -h postgres -p ${DATABASE_PORT} -t 45 --strict -- npx prisma db push --force-reset && npx prisma generate && yarn start:prod"]
