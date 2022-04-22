#!/bin/sh

npm exec vite build
php please ssg:generate
