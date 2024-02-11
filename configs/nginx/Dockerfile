ARG UPSTREAM_VERSION

FROM nginx:${UPSTREAM_VERSION}

RUN apt-get update && \
    apt-get install -y cron certbot python3-certbot-nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY scripts/ssl-updater.sh /etc/ssl-updater.sh
COPY scripts/update-ssl.sh /usr/local/bin/update-ssl
COPY scripts/05-setup.sh /docker-entrypoint.d/
