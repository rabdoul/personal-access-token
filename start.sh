#!/bin/bash
dockerImage='cutting-room-production-process'
if [[ "$OSTYPE" == "linux-gnu" ]]; then
    rabbitMQHost='--network host -e RABBITMQ_HOST=localhost'
else
    rabbitMQHost='-e RABBITMQ_HOST=host.docker.internal'
fi
docker build -t $dockerImage .
docker run --rm --env-file server/.env $rabbitMQHost -p8081:8080 $dockerImage