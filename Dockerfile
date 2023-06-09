FROM node:current-alpine3.17
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# RUN npm install
# If you are building your code for production
RUN npm ci --only=production
RUN npm install typescript
ENV PORT=8000

COPY . .

RUN npm run build

EXPOSE 8000

CMD [ "node", "dist/server.js" ]
