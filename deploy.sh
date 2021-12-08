#!/bin/bash

Env="$1"
DOMAIN=saifu-test.api.com
SWREGION="$2"
yaml2json swagger.yaml | jq . > output/swagger_json.json
sed -ie 's/SWENV/'${Env}'/g' output/swagger_json.json
sed -ie 's/APIDOMAIN/'${DOMAIN}'/g' output/swagger_json.json
sed -ie 's/SWREGION/'${SWREGION}'/g' output/swagger_json.json

aws cloudformation package          \
    --s3-bucket mycloud-saifu1             \
    --template-file tem.yaml    \
    --region $SWREGION               \
    --output-template-file output/output.yaml 

aws cloudformation deploy \
  --s3-bucket mycloud-saifu1       \
  --template-file output/output.yaml \
  --stack-name WorkshopStack \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides Env=$Env