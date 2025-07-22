FROM node:alpine
WORKDIR /app
RUN apk add --no-cache \
    python3 \
    py3-pip \
    chromium \
    chromium-chromedriver \
    dbus \
    font-noto-emoji \
    ttf-freefont \
    && ln -sf python3 /usr/bin/python

RUN if ! getent group chrome; then addgroup -S chrome; fi && \
    if ! getent passwd chrome; then adduser -S chrome -G chrome; fi

COPY requirements.txt ./
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

COPY package*.json ./
COPY yarn.lock* ./

RUN yarn install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN yarn run build

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver
ENV DISPLAY=:99
ENV CHROME_OPTS="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu --disable-extensions --disable-setuid-sandbox --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-renderer-backgrounding"

RUN mkdir -p static/images uploads
RUN chown -R node:node /app static uploads
USER node

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "=== Starting application initialization ==="' >> /app/start.sh && \
    echo 'echo "Waiting for database to be ready..."' >> /app/start.sh && \
    echo 'sleep 10' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'echo "Testing database connection..."' >> /app/start.sh && \
    echo 'max_attempts=30' >> /app/start.sh && \
    echo 'attempt=1' >> /app/start.sh && \
    echo 'until npx prisma db push --accept-data-loss --force-reset 2>/dev/null || [ $attempt -eq $max_attempts ]; do' >> /app/start.sh && \
    echo '  echo "Database connection attempt $attempt/$max_attempts failed. Retrying in 2 seconds..."' >> /app/start.sh && \
    echo '  sleep 2' >> /app/start.sh && \
    echo '  attempt=$((attempt + 1))' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'if [ $attempt -eq $max_attempts ]; then' >> /app/start.sh && \
    echo '  echo "Failed to connect to database after $max_attempts attempts"' >> /app/start.sh && \
    echo '  exit 1' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'echo "Database connection successful!"' >> /app/start.sh && \
    echo 'echo "Creating/updating database schema..."' >> /app/start.sh && \
    echo 'npx prisma db push --accept-data-loss' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'echo "Generating Prisma client..."' >> /app/start.sh && \
    echo 'npx prisma generate' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'echo "=== Database initialization complete ==="' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'yarn run start:prod' >> /app/start.sh && \
    chmod +x /app/start.sh

ENTRYPOINT ["/app/start.sh"]
