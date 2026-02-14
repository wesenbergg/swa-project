#!/bin/bash
set -e

# This script sets up PostgreSQL streaming replication
# It runs when the replica container starts for the first time

PGDATA="/var/lib/postgresql/data"

# If PGDATA is empty, we need to initialize from the primary
if [ ! -s "$PGDATA/PG_VERSION" ]; then
    echo "Initializing replica from primary database..."
    
    # Wait for primary to be ready
    until pg_isready -h $PRIMARY_HOST -U $POSTGRES_USER; do
        echo "Waiting for primary database to be ready..."
        sleep 2
    done
    
    # Remove any existing data directory contents
    rm -rf $PGDATA/*
    
    # Create base backup from primary
    pg_basebackup -h $PRIMARY_HOST -D $PGDATA -U replicator -v -P -W -R
    
    # Create standby.signal file to mark this as a replica
    touch $PGDATA/standby.signal
    
    echo "Replica initialization complete!"
fi

# Start PostgreSQL
exec docker-entrypoint.sh postgres
