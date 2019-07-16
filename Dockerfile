FROM node:12-alpine
MAINTAINER fossapps gautam.nishchal@gmail.com
WORKDIR /app
ADD node_modules ./node_modules
ADD ./lib ./lib
EXPOSE 3000
ADD package.json ./package.json
CMD ["node", "./lib/server.js"]
