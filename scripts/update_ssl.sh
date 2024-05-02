#!/bin/env bash

scriptDir=$(dirname "$0")
root=$(readlink -f "$scriptDir/..")

source "$root/.env"

export CERT_DIR_PATH="$root/configs/certbot/letsencrypt";
export WEBROOT_PATH="$root/configs/certbot/www";
export LE_RENEW_HOOK="docker compose restart nginx";
export DOMAINS="$DOMAIN";
export EMAIL="$EMAIL";
export EXP_LIMIT="30";
export CHICKENEGG="0";
export STAGING="0";
export CHOWN="$UID:$GID"

bash "$root/configs/nginx/scripts/ssl-updater.sh"
