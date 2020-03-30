# Thesis Backend Server

This repository contains the code used to manage the backend of the application developed for my thesis project. The code is written in TypeScript on Node.js. It is deployed using Docker.

## Commands

To run the server directly:

```
npm start
```

OR

```
npm run dev
```

To run it with docker:

```docker
docker pull zenthurion/thesis-backend-server
docker run -d -p 3001:3001 --name backend zenthurion/thesis-backend-server
```
