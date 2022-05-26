#!/bin/bash
set -eu

npm exec vite build
php please ssg:generate
