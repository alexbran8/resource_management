#!/bin/bash

# cd /root/srv/app

#build docker container
docker build -t nptjenkins .


# stop existing container
docker stop nptjenkins && docker rm nptjenkins

# delete existing container

# delete existing image


# how to import name and ip from .env???
# run new image
docker run  -d -p 5001:4000  --name nptjenkins nptjenkins
