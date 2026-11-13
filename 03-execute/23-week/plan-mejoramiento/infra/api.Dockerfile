# Image for the Laravel API. Build context: ../api
FROM php:8.3-cli

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev unzip git \
    && docker-php-ext-install pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/api
COPY . .
RUN composer install --no-interaction --prefer-dist

EXPOSE 8000

# Migrate the empty database, then serve.
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000
