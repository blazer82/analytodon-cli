FROM ubuntu:22.04

ARG NEWRELIC_LICENSE_KEY

WORKDIR /analytodon-cli

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y --no-install-recommends install -y cron curl ca-certificates

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

# Remove package lists for smaller image sizes
RUN rm -rf /var/lib/apt/lists/* \
    && which cron \
    && rm -rf /etc/cron.*/*

COPY crontab hello-cron
COPY entrypoint.sh entrypoint.sh
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY newrelic.js newrelic.js
COPY tsconfig.json tsconfig.json
COPY README.md README.md
COPY bin bin
COPY src src

RUN npm ci
RUN npm i typescript
RUN npm run build

RUN ./bin/run hello analytodon -f "the build process"

RUN crontab hello-cron
RUN chmod +x entrypoint.sh

ENTRYPOINT ["/analytodon-cli/entrypoint.sh"]

# https://manpages.ubuntu.com/manpages/trusty/man8/cron.8.html
# -f | Stay in foreground mode, don't daemonize.
# -L loglevel | Tell  cron  what to log about jobs (errors are logged regardless of this value) as the sum of the following values:
CMD ["cron","-f", "-L", "2"]