#!/usr/bin/env bash

export CERT_DIR_PATH="/etc/letsencrypt";
export WEBROOT_PATH="/var/www/certbot";
export LE_RENEW_HOOK="nginx -s reload";
export DOMAINS="$DOMAIN";
export EMAIL="$EMAIL";
export EXP_LIMIT="30";
export CHICKENEGG="0";
export STAGING="0";
export CHOWN="$UID:$GID"
export NATIVE_CERTBOT="1"

bash "/etc/ssl-updater.sh"
