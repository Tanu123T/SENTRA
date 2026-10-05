-- SENTRA database inspection and reporting queries.
-- This file is read-only: it does not create, update, or delete data.

-- Confirm the active database and user.
SELECT current_database(), current_user;

-- List all SENTRA application tables.
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'sentra'
ORDER BY table_name;

-- Count rows in each SENTRA application table.
SELECT 'wards' AS table_name, COUNT(*) AS row_count
FROM sentra.wards
UNION ALL
SELECT 'weather_observations', COUNT(*)
FROM sentra.weather_observations
UNION ALL
SELECT 'risk_assessments', COUNT(*)
FROM sentra.risk_assessments
UNION ALL
SELECT 'population_exposure', COUNT(*)
FROM sentra.population_exposure
UNION ALL
SELECT 'resources', COUNT(*)
FROM sentra.resources
UNION ALL
SELECT 'resource_allocations', COUNT(*)
FROM sentra.resource_allocations
UNION ALL
SELECT 'simulations', COUNT(*)
FROM sentra.simulations
ORDER BY table_name;

-- List SENTRA columns, types, and nullability.
SELECT table_name, ordinal_position, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'sentra'
ORDER BY table_name, ordinal_position;

-- List foreign-key relationships.
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'sentra'
  AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;

-- List indexes on SENTRA tables.
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'sentra'
ORDER BY tablename, indexname;

-- Verify PostGIS geometry types and SRIDs.
SELECT f_table_name, f_geometry_column, type, srid
FROM geometry_columns
WHERE f_table_schema = 'sentra'
ORDER BY f_table_name, f_geometry_column;
