# syntax=docker/dockerfile:1

ARG PHP_VERSION=8.4
ARG NODE_VERSION=23
ARG APP_ENV=production
ARG NODE_ENV=production
ARG TZ=Asia/Tokyo


FROM php:${PHP_VERSION}-fpm AS php-base
ARG TZ
RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone
RUN ln -snf "${PHP_INI_DIR}/php.ini-production" "${PHP_INI_DIR}/php.ini"
RUN curl -sLS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer
RUN \
    --mount=type=cache,target=/var/lib/apt/,sharing=locked \
    --mount=type=cache,target=/var/cache/apt/,sharing=locked \
    apt update && apt install -y --no-install-recommends \
    postgresql-common \
    && /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y \
    && apt install -y --no-install-recommends \
    libpq-dev \
    libzip-dev \
    lsof \
    postgresql-client \
    && apt -y autoremove
RUN \
    --mount=type=cache,target=/tmp/pear/,sharing=locked \
    docker-php-ext-install \
    pdo_pgsql \
    zip \
    && docker-php-ext-enable \
    opcache \
    && exit 0
ARG APP_ENV
ENV APP_ENV=${APP_ENV}


FROM node:${NODE_VERSION}-slim AS node-base
WORKDIR /var/www/html/
ARG TZ
RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone
RUN \
    --mount=type=cache,target=/var/lib/apt/,sharing=locked \
    --mount=type=cache,target=/var/cache/apt/,sharing=locked \
    apt update && apt install -y --no-install-recommends \
    curl \
    && apt -y autoremove
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}


FROM php-base AS composer
RUN \
    --mount=source=./composer.json,target=./composer.json \
    --mount=source=./composer.lock,target=./composer.lock \
    --mount=type=cache,target=/root/.composer/,sharing=locked \
    composer install --no-autoloader `([ "${APP_ENV}" = "production" ]) && echo --no-dev`
COPY ./bootstrap/ ./bootstrap/
COPY ./storage/ ./storage/
RUN \
    --mount=source=./composer.json,target=./composer.json \
    --mount=source=./composer.lock,target=./composer.lock \
    --mount=source=./artisan,target=./artisan \
    --mount=source=./app/,target=./app/ \
    --mount=source=./database/,target=./database/ \
    --mount=source=./routes/,target=./routes/ \
    --mount=source=./resources/,target=./resources/ \
    composer dump-autoload `([ "${APP_ENV}" = "production" ]) && echo --classmap-authoritative` \
    && if [ "${APP_ENV}" = "production" ];then ./artisan optimize && ./artisan config:clear;fi


FROM node-base AS npm
RUN \
    --mount=source=./package.json,target=./package.json \
    --mount=source=./package-lock.json,target=./package-lock.json \
    --mount=type=cache,target=/root/.npm/,sharing=locked \
    npm clean-install --include=dev
COPY package.json package-lock.json postcss.config.ts tailwind.config.ts tsconfig.json vite.config.ts ./
COPY ./resources/ ./resources/


FROM npm AS storybook
RUN \
    --mount=type=cache,target=/var/lib/apt/,sharing=locked \
    --mount=type=cache,target=/var/cache/apt/,sharing=locked \
    apt update && apt install -y --no-install-recommends \
    xdg-utils \
    && apt -y autoremove
COPY .storybook/ .storybook/
CMD ["npm", "run", "storybook"]
HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --start-interval=1s --retries=1 \
    CMD ["curl", "-sf", "http://localhost:6006"]


FROM npm AS node
COPY --from=composer /var/www/html/vendor/tightenco/ziggy/ ./vendor/tightenco/ziggy/
RUN npm run build
COPY .eslintrc.json .prettierrc eslint.config.ts ./
CMD ["npm", "run", "dev"]
HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --start-interval=1s --retries=1 \
    CMD ["curl", "-sSo", "/dev/null", "http://localhost:5173"]


FROM node-base AS ssr
RUN \
    --mount=source=package.json,target=package.json \
    --mount=source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm/,sharing=locked \
    npm clean-install --omit=dev
COPY --from=node /var/www/html/bootstrap/ssr/ ./bootstrap/ssr/
ENTRYPOINT ["/usr/local/bin/node"]
CMD ["bootstrap/ssr/ssr.js"]
HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --start-interval=1s --retries=1 \
    CMD ["curl", "-sf", "http://localhost:13714"]
EXPOSE 13714


FROM nginx AS nginx
WORKDIR /var/www/html/
ARG TZ
RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/
COPY ./public/ ./public/
COPY --from=node /var/www/html/public/build/ ./public/build/
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1
HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --start-interval=1s --retries=1 \
    CMD ["curl", "-sf", "http://localhost/up"]
VOLUME /var/run/php/
EXPOSE 80


FROM php-base
RUN if [ "${APP_ENV}" = "local" ];then ln -snf /var/www/html /opt/project ;fi
RUN \
    --mount=type=cache,target=/tmp/pear/,sharing=locked \
    if [ "${APP_ENV}" = "local" ];then \
        pecl install \
        xdebug \
        && docker-php-ext-enable \
        xdebug \
    ;fi
ARG NODE_VERSION
RUN \
    --mount=type=cache,target=/var/lib/apt/,sharing=locked \
    --mount=type=cache,target=/var/cache/apt/,sharing=locked \
    if [ "${APP_ENV}" = "local" ];then \
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
        && apt update && apt install -y --no-install-recommends \
        nodejs \
        && apt -y autoremove \
    ;fi
ARG WWWGROUP=0
RUN if [ "${APP_ENV}" = "local" ];then \
        groupadd --force -g ${WWWGROUP} sail \
        && useradd -ms /bin/bash --no-user-group -g ${WWWGROUP} -G root,www-data --non-unique -u 0 sail \
    ;fi
RUN \
    --mount=source=./docker/php/zz-php-development.ini,target=/tmp/zz-php-development.ini \
    if [ "${APP_ENV}" = "local" ];then \
        cp /tmp/zz-php-development.ini /usr/local/etc/php/conf.d/zz-php-development.ini \
    ;fi
COPY ./docker/php/php.ini /usr/local/etc/php/conf.d/
COPY ./docker/php/zz-docker.conf /usr/local/etc/php-fpm.d/
COPY . .
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
RUN \
    --mount=from=npm,source=/var/www/html/node_modules,target=/tmp/node_modules \
    if [ "${APP_ENV}" = "local" ];then cp -r /tmp/node_modules/ ./ ;fi
COPY --from=composer /var/www/html/vendor/ ./vendor/
COPY --from=composer --chmod=777 /var/www/html/bootstrap/ ./bootstrap/
COPY --from=composer --chmod=777 /var/www/html/storage/ ./storage/
COPY --from=node /var/www/html/public/build/ ./public/build/
COPY --from=node /var/www/html/bootstrap/ssr/ ./bootstrap/ssr/
HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --start-interval=1s --retries=1 \
    CMD ["lsof", "/var/run/php/php-fpm.sock"]
VOLUME /var/run/php/
EXPOSE 8000
