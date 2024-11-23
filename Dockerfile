FROM node:latest

RUN mkdir -p /usr/src/stagestream_frontend
WORKDIR /usr/src/stagestream_frontend

COPY package.json /usr/src/stagestream_frontend
RUN apt-get update
RUN apt-get install -y build-essential
RUN npm install --build-from-source

RUN npm install -g typescript

COPY . /usr/src/stagestream_frontend

RUN tsc

CMD ["node", "build/index.js"]