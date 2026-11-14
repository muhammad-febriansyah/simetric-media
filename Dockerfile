# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Base: PHP 8.4 FPM with the extensions Laravel and this app need.
# ---------------------------------------------------------------------------
FROM php:8.4-fpm-alpine AS php-base

COPY --from=mlocati/php-extension-installer:2 /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_mysql intl zip gd bcmath exif opcache pcntl \
    && apk add --no-cache su-exec

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
WORKDIR /var/www/html

# ---------------------------------------------------------------------------
# Production PHP dependencies (no dev packages).
# ---------------------------------------------------------------------------
FROM php-base AS vendor

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --no-scripts --no-autoloader --prefer-dist

# ---------------------------------------------------------------------------
# Front-end build. Wayfinder runs `php artisan wayfinder:generate` during the
# Vite build, so this stage needs PHP, the vendor directory and Node together.
# ---------------------------------------------------------------------------
FROM vendor AS assets

RUN apk add --no-cache nodejs npm
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN cp .env.example .env \
    && composer dump-autoload --optimize --no-dev \
    && php artisan key:generate --force \
    && npm run build \
    && rm -rf node_modules .env

# ---------------------------------------------------------------------------
# Runtime image for PHP-FPM (also used by the queue worker).
# ---------------------------------------------------------------------------
FROM php-base AS app

COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY --from=vendor /var/www/html/vendor ./vendor
COPY . .
COPY --from=assets /var/www/html/public/build ./public/build
COPY docker/entrypoint.sh /usr/local/bin/entrypoint

RUN composer dump-autoload --optimize --no-dev \
    && rm -f /usr/local/bin/composer \
    && mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod +x /usr/local/bin/entrypoint

ENTRYPOINT ["entrypoint"]
CMD ["php-fpm"]

# ---------------------------------------------------------------------------
# Nginx serving the public directory and passing PHP requests to the app.
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS web

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=app /var/www/html/public /var/www/html/public
RUN ln -s /var/www/html/storage/app/public /var/www/html/public/storage
