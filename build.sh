#!/bin/sh

npx mix --production
php please ssg:generate
