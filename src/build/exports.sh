#!/bin/bash
API_DIR="${PWD}"
API_SRC="${API_DIR}/src"
IDX_FILE="${API_SRC}/index.ts"
echo "${API_DIR}"
if [ -d "$API_DIR" ]; 
then
    echo "Located dir: src"
    eval "$(npx tsx src/build/getExports.ts)"
    echo "${pkg}" > ${API_SRC}/index.ts 
else
    echo -e "Error: Unable to locate /bevor_api/src"
fi
