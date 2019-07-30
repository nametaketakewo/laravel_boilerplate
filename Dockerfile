FROM php:7.3-fpm-alpine

RUN docker-php-ext-install pdo_mysql mbstring &&\
    apk add --no-cache --update --virtual=.runtime-dependencies composer

RUN composer config -g repos.packagist composer https://packagist.jp &&\
    composer global require hirak/prestissimo

ADD artisan composer.json composer.lock /var/www/html/
ADD config /var/www/html/config
ADD routes /var/www/html/routes
ADD database /var/www/html/database
ADD bootstrap /var/www/html/bootstrap
ADD app/Console /var/www/html/app/Console
ADD app/Providers /var/www/html/app/Providers
ADD app/Exceptions /var/www/html/app/Exceptions

RUN composer install &&\
    composer clear-cache &&\
    composer global clear-cache

ADD ./ /var/www/html
