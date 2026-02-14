#!/bin/bash
set -e

PGDATA="/var/lib/postgresql/data"

# Check if this is first run (empty data directory)
if [ -z "$(ls -A $PGDATA)" ]; then
    echo "First run detected - setting up replication from primary..."
    
    # Wait for primary to be ready
    echo "Waiting for primary database..."
    until PGPASSWORD=admin123 psql -h "$PRIMARY_HOST" -U admin -d events_db -c '\q' 2>/dev/null; do
        echo "Primary not ready yet, waiting..."
        sleep 2
    done
    
    echo "Primary is ready. Creating base backup..."
    
    # Create base backup from primary using pg_basebackup
    # -h: host, -D: data directory, -U: user, -Fp: plain format, -Xs: stream WAL, -P: progress, -R: write recovery config
    PGPASSWORD=replica123 pg_basebackup -h "$PRIMARY_HOST" -D "$PGDATA" -U replicator -Fp -Xs -P -R
    
    echo "Base backup completed successfully!"
    
    # The -R flag creates standby.signal and writes connection info to postgresql.auto.conf
    # We need to ensure proper settings are in place
    cat >> "$PGDATA/postgresql.auto.conf" <<EOF
# Replica configuration
primary_conninfo = 'host=$PRIMARY_HOST port=5432 user=replicator password=replica123'
primary_slot_name = 'replica_slot'
EOF
    
    # Fix ownership to postgres user
    chown -R postgres:postgres "$PGDATA"
    chmod 700 "$PGDATA"
    
    echo "Replication configuration complete!"
fi

# Start PostgreSQL as postgres user with custom config
exec su-exec postgres postgres -c config_file=/etc/postgresql/postgresql.conf
