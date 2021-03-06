#!/bin/bash
set -ex

# backup database
docker exec -it db bash -c "pg_dump -c --if-exists --no-acl -O -U postgres fce | grep -v -E 'DROP\ SCHEMA\ IF\ EXISTS\ public|CREATE\ SCHEMA\ public|COMMENT\ ON\ SCHEMA\ public'" | gzip > backup.sql.gz

# download sirene files
docker exec -it server ash -c "NODE_ENV=production node ./shell/run.js DownloadSirene"

# import sirene into database
docker exec -it server ash -c "NODE_ENV=production node ./shell/run.js ImportSirene --enterprises_filename StockUniteLegale_utf8.zip --establishments_filename StockEtablissement_utf8.zip"

# clean files
rm -f StockUniteLegale_utf8.zip
rm -f StockEtablissement_utf8.zip

# re-index
docker-compose exec server ash -c "NODE_ENV=production node ./scripts/appsearchIndexer.js"
