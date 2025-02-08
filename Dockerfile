# syntax=docker/dockerfile:1

FROM node:18
ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app

COPY [".prod.env", ".env"]
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install -g npm

RUN npm install --omit=dev

COPY . .

RUN npm run build

RUN npm install pm2 -g

RUN rm package.json

CMD ["pm2-runtime", "start", "deploy/pm2.config.json"]