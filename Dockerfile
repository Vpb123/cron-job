FROM node:16.15.1-alpine3.16

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Create app directory
WORKDIR /app

ENV NODE_OPTIONS --max-old-space-size=4096

# Install app dependencies
COPY package.json .

RUN apk update && apk add vim jq busybox-extras

RUN npm install pm2 -g

RUN npm install --save-exact


# Bundle app source
COPY . .

CMD ["pm2-docker", "index.js"]