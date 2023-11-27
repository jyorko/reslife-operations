#!/bin/bash

# Generate timestamp
timestamp=$(date -u +"%Y%m%d%H%M%S")

# Generate image tags
image_tag_nextjs="my-nextjs-image:${timestamp}"
image_tag_nginx="my-nginx-image:${timestamp}"
image_tag_nodejs="my-nodejs-image:${timestamp}"

# Build images
docker build -t ${image_tag_nextjs} ./nextjs
docker build -t ${image_tag_nginx} ./nginx
docker build -t ${image_tag_nodejs} ./node

# Update .env file
rm -f .env
echo "NGINX_IMG=${image_tag_nginx}" >> .env
echo "NODEJS_IMG=${image_tag_nodejs}" >> .env
echo "NEXTJS_IMG=${image_tag_nextjs}" >> .env

# Run docker compose
docker-compose down
docker-compose up -d

# Clean up old images
docker image prune -f --all --filter "until=1h"