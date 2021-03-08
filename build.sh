#!/bin/sh

yarn run sass resources/sass/main.scss public/css/main.css --embed-sources
yarn run postcss public/css/main.css --replace --map --env production
yarn run rollup -c
php please ssg:generate
