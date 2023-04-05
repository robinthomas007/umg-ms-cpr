#!/bin/bash


USER_DATA=`echo "$USER_DATA" | base64 --decode`

echo "userdata ------------------------------======================= $USER_DATA"

npm run build:dev
