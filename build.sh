#!/bin/sh

yarn run sass resources/sass/main.scss public/css/main.css --embed-sources
yarn run rollup -c
php please ssg:generate
yarn run postcss $PUBLIC_DIR/css/main.css --replace --map --env production
