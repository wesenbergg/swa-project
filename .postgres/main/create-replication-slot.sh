#!/bin/bash
set -e

# This script creates a physical replication slot on the primary
# The replica will use this slot for streaming replication

echo "Creating replication slot..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create physical replication slot for the replica
    SELECT pg_create_physical_replication_slot('replica_slot');
EOSQL

echo "Replication slot 'replica_slot' created successfully!"
