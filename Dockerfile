FROM node:current-slim

COPY . . 

RUN npm install

RUN npm run build

EXPOSE 3001

CMD [ "npm", "start" ]