#!/bin/bash
set -eu

pnpm vite build
php please ssg:generate
