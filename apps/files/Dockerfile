FROM node:20.0.0-alpine As development
RUN npm i -g pnpm

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:20.0.0-alpine as production
RUN apk --no-cache add tzdata && \
	cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
	echo "Asia/Seoul" > /etc/timezone \
	apk del tzdata

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --prod
COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/files/main"]
