#!/usr/bin/env bash

CERT_FILE="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"

if [ ! -d "/etc/nginx/templates" ]; then
    echo "Creation of the directory /etc/nginx/templates"
    mkdir -p /etc/nginx/templates
fi

cp -r /tmp/templates/* /etc/nginx/templates

if [ -f "$CERT_FILE" ]; then
    echo "SSL certificate found"
    cp -r /tmp/templates/* /etc/nginx/templates/
    mv -f /etc/nginx/templates/with-ssl.conf.template /etc/nginx/templates/default.conf.template
else
    cp -r /tmp/templates/* /etc/nginx/templates/
    rm /etc/nginx/templates/with-ssl.conf.template
fi

cp -r /tmp/config/* /etc/nginx/

echo "The configuration files have been copied successfully"

# Renew SSL monthly

printenv > /etc/environment

(crontab -l 2>/dev/null; echo "0 0 1 * * . /etc/environment; update-ssl > /var/log/update-ssl.log 2>&1") | crontab -

service cron start
