#!/bin/bash

USER_DATA=`echo "$USER_DATA" | base64 --decode`
ENV_VARIABLE=`echo "$USER_DATA" | jq -r '.ENV_VARIABLE'`

npm run build:$ENV_VARIABLE
