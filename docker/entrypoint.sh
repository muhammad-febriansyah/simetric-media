#!/bin/sh
set -e

cd /var/www/html

# Named volumes may start empty; make sure Laravel's storage tree exists.
mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

artisan() {
    su-exec www-data php artisan "$@"
}

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    artisan migrate --force
fi

artisan optimize
artisan storage:link --force >/dev/null 2>&1 || true

exec "$@"
