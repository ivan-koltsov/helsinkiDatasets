#!/bin/bash
set -e

echo "Starting Helsinki Region Data Sources Backend..."

# Wait for database to be ready
echo "Waiting for database at ${DATABASE_URL}..."
MAX_RETRIES=30
COUNT=0

until python -c "import psycopg2; psycopg2.connect('${DATABASE_URL}')" 2>/dev/null || [ $COUNT -eq $MAX_RETRIES ]; do
  echo "Database not ready yet ($COUNT/$MAX_RETRIES), sleeping..."
  sleep 2
  COUNT=$((COUNT+1))
done

if [ $COUNT -eq $MAX_RETRIES ]; then
  echo "ERROR: Database connection timed out!"
  exit 1
fi

echo "Database is up - seeding data..."
python seed.py

echo "Launching application..."
python app.py
