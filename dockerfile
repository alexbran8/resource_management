# Dockerfile
FROM node:16
# copy source and install dependencies
RUN mkdir -p /opt/app
RUN cd ..
# COPY start-server.sh /opt/app/
# COPY build.sh /opt/app/
COPY . /opt/app/
# build frontendk
WORKDIR /opt/app/client
RUN ls -l
RUN pwd

RUN rm -rf node_modules
RUN npm install -g npm@latest
RUN npm install --save-dev cross-env
RUN npm run dev

# backend
WORKDIR /opt/app/server
RUN npm install
RUN npm install --save-dev cross-env
RUN npm install pm2 -g

# start server
EXPOSE 4000
STOPSIGNAL SIGTERM
CMD rm -rf /etc/localtime && ln -s /usr/share/zoneinfo/Etc/GMT-2 /etc/localtime && pm2-runtime start /opt/app/server/index.js -i max