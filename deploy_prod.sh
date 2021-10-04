#!/bin/bash

# cd /root/srv/app

#build docker container
docker build -t nptproduction .


# stop existing container
docker stop nptproduction && docker rm nptproduction

# delete existing container

# delete existing image


# how to import name and ip from .env???
# run new image
docker run  -d -p 5021:4000  --name nptproduction nptproduction
