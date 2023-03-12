-- Create testing & live db, add schemas & seed info.
DROP DATABASE IF EXISTS firstfive_test;
CREATE DATABASE firstfive_test;
\connect firstfive_test;

-- run / call these scripts to add schema and seed the db
\i firstFive-schema.sql
\i firstFive-seed.sql

DROP DATABASE IF EXISTS firstfive;
CREATE DATABASE firstfive;
\connect firstfive;

\i firstFive-schema.sql
\i firstFive-seed.sql


