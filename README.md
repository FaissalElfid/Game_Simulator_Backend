# Game Simulator Backend

## Docker

If you want to just run the webapp without any setup:
1. [Install Docker](https://docs.docker.com/get-docker/)
2. [Install docker-compose](https://docs.docker.com/compose/install/)

## Setup

1. Install [node.js](https://nodejs.org/en/) (version 14 LTS recommended)
2. In the project root, run `docker-compose up` (you'll need to install docker and docker-compse, see instructions above): this command will start up Kafka and Zookeeper on port 9092 on your computer.
3. Go to the challenge-service + api-gateway + user-service, run `npm install` and then `npm start:dev`

## Packages

* This is the backend server, which uses the Express and NestJS frameworks. you can start it from the section above.
* To start the frontend, which is a React application. Run `npm run start` (in [Game Simulator Front-end](https://github.com/FaissalElfid/Game_simulator_frontEnd)) to start the front end in development mode.