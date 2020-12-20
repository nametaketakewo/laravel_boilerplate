
ARG PHP_VERSION=8
ARG COMPOSER_VERSION=2.0

FROM composer:${COMPOSER_VERSION} AS composer
COPY composer.json composer.lock ./
ARG APP_ENV=production
ENV APP_ENV $APP_ENV
RUN composer install --no-scripts --no-autoloader `([ "${APP_ENV}" = "production" ]) && echo --no-dev || echo --dev` &&\
    composer clear-cache &&\
    composer global clear-cache
COPY ./ .
RUN composer dump-autoload --optimize
ENTRYPOINT ["/usr/bin/composer"]

FROM node:alpine AS npm
WORKDIR /var/www/html
COPY package*.json ./
RUN npm install
COPY ./webpack.mix.js .
COPY ./public ./public
COPY ./resources ./resources
ARG APP_ENV=production
ENV APP_ENV $APP_ENV
RUN npm run `([ "${APP_ENV}" = "production" ]) && echo prod || echo dev`
ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["run", "watch"]

FROM php:${PHP_VERSION}-fpm-alpine AS artisan
RUN apk add --no-cache --update tzdata &&\
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime &&\
    apk del tzdata
RUN apk add --no-cache --update --virtual=.runtime-dependencies icu-dev procps git oniguruma-dev &&\
    docker-php-ext-install intl mbstring pdo_mysql opcache &&\
    apk add --no-cache --update --virtual=.build-dependencies autoconf g++ make &&\
    pecl install redis &&\
    docker-php-ext-enable redis &&\
    apk del .build-dependencies
ARG APP_ENV=production
ENV APP_ENV $APP_ENV
RUN if [ "${APP_ENV}" != "production" ];then\
        ln -s /var/www/html /opt/project &&\
        apk add --no-cache --update --virtual=.build-dependencies autoconf g++ make &&\
        pecl install xdebug &&\
        docker-php-ext-enable xdebug &&\
        apk del .build-dependencies &&\
        { \
            echo '[xdebug]'; \
            echo 'xdebug.mode=debug'; \
            echo 'xdebug.start_with_request=yes'; \
            echo 'xdebug.client_host=host.docker.internal'; \
        } >> /usr/local/etc/php/conf.d/xdebug.ini \
    ;fi
COPY --from=composer /usr/bin/composer /usr/bin/composer
COPY --from=composer /app/vendor ./vendor
COPY --from=npm /var/www/html/public ./public
COPY ./ .
RUN chown www-data:www-data -R storage bootstrap
EXPOSE 8000 80
ENTRYPOINT ["/var/www/html/artisan"]
CMD ["serve", "--host=0.0.0.0", "--port=80"]
