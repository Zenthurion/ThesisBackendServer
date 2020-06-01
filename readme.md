# Source Code for my Thesis Project

The source code is split into two parts: The backend server, and the client server. Each part has its own GitHub repository. Below is a description on how to navigate the repository to find the relevant source code. There is also a description on how to run the system, although an already running instance of the latest version can be found on http://142.93.44.236:3000/.

| Repository | URL                                               |
| ---------: | ------------------------------------------------- |
|    Backend | https://github.com/Zenthurion/ThesisBackendServer |
|     Client | https://github.com/Zenthurion/ThesisClientServer  |

---

## Backend Server

This repository contains the code used to manage the backend of the application developed for my thesis project. The code is written in TypeScript on Node.js. It is deployed using Docker.

### Source

The code written by me can be found in the src/ directory. The only sub-directory of relevance within this directory is the events/ directory which contains the code used to ensure a modicum of type-safety between the server and clients. This folder is identical between the two repositories. The models/ and routes/ directories are not in use.

Next to the src directory is the presentations/ directory which contains the final version of the presentation content in the format specified in the report.

Outside of these folders are the associated configuration files.

### How to Run

First, it is necessary to initialise node.js. The system has been implemented and tested using version 12 LTS. Once node is installed, run:

```
npm install
```

Then, to run the server directly:

```
npm start
```

OR

```
npm run dev
```

The application runs on port 3001 (e.g. 127.0.0.1:3001)

To run it with docker:

```docker
docker pull zenthurion/thesis-backend-server
docker run -d -p 3001:3001 --name backend zenthurion/thesis-backend-server
```
