#!/bin/bash

Env="$1"
DOMAIN=saifu-test.api.com
SWREGION="$2"
yaml2json swagger.yaml | jq . > output/swagger_json.json
sed -ie 's/SWENV/'${Env}'/g' output/swagger_json.json
sed -ie 's/APIDOMAIN/'${DOMAIN}'/g' output/swagger_json.json
sed -ie 's/SWREGION/'${SWREGION}'/g' output/swagger_json.json

aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name WorkshopStack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides Env=$Env \
  ApiDomain=$DOMAIN