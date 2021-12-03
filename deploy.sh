#!/bin/bash

Env="$1"
yaml2json swagger.yaml | jq . > output/swagger_json.json

aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name WorkshopStack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides Env=$Env