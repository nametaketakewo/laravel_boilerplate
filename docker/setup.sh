#!/bin/bash

if [ -e /.dockerenv ];then
    if [ "${REMOTE_CONTAINERS}" = "true" ];then
        apt update && apt install -y --no-install-recommends git openssh-client
    fi
    composer install
    npm clean-install --include=dev
    ./artisan config:show app.key | grep base64: &> /dev/null || ./artisan key:generate --ansi --force
    ./artisan migrate --seed --graceful --ansi
else
    if [ ! -f ./.env ];then rm -rf ./.env && cp -f ./.env.example ./.env;fi
    if docker compose &> /dev/null;then
        DOCKER_COMPOSE=(docker compose)
    else
        DOCKER_COMPOSE=(docker-compose)
    fi
    "${DOCKER_COMPOSE[@]}" up laravel.test -d
    "${DOCKER_COMPOSE[@]}" exec laravel.test ./docker/setup.sh
    "${DOCKER_COMPOSE[@]}" down --remove-orphans
fi
