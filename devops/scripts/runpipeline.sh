#!/bin/bash

set -e

ENVIRONMENT=""
ENV=${ENV:-"dev"}
case "$ENV" in
    "dev") 
        export ENVIRONMENT="awsa1-hybrid-nonprod-v2/cprportal-dev" 
        ;;
    "qa") 
        export ENVIRONMENT="awsa1-hybrid-nonprod-v2/cprportal-qa" 
        ;;
    "uat") 
        export ENVIRONMENT="awsa2-hybrid-uat-v2/cprportal-uat" 
        ;;
    "prod") 
        export ENVIRONMENT="awsa3-hybrid-prod-v2/cprportal-prod" 
        ;;
esac

IMAGE_URL=${IMAGE_URL:-"docker-registry.umusic.com/cprportal/cprportal-web"}

export CLUSTER=`echo $ENVIRONMENT | cut -d/ -f1`
export NAMESPACE=`echo $ENVIRONMENT | cut -d/ -f2`
export ENV=`echo $NAMESPACE | awk -F'-' '{print $NF}'`
GIT_REF=${GIT_REF:-"$GITHUB_REF"}
GIT_COMMIT=${GIT_COMMIT:-"$GITHUB_SHA"}
PIPELINE=${PIPELINE:-"buildx-deploy"}
DOCKERFILE=${DOCKERFILE:-"devops/docker/Dockerfile"}
CONTEXT=${CONTEXT:-""}
YAML_PATH=${YAML_PATH:-"devops/app.yaml"}
YAML_DIR=${YAML_DIR:-"devops/k8s"}
PLATFORMS=${PLATFORMS:-"linux/amd64,linux/arm64"}
USE_CACHE=${USE_CACHE:-"true"}

IMAGE_TAG="$GIT_COMMIT-$ENV"

USER_DATA='{
    "VAULT_KV_PATH": "cprportal/web/'$ENV'"
}'

USER_DATA=`echo "$USER_DATA" | base64`

cat > trigger.json <<-EOF
{
    "API": {
        "APIVersion": "v1",
        "Pipeline": "$PIPELINE"
    },
    "Git": {
        "Ref": "$GIT_REF",
        "Revision": "$GIT_COMMIT",
        "URL": "https://github.com/$GITHUB_REPOSITORY"
    },
    "Image": {
        "URL": "$IMAGE_URL",
        "Tag": "$IMAGE_TAG",
        "Dockerfile": "$DOCKERFILE",
        "Context": "$CONTEXT",
        "Cache": "$USE_CACHE",
        "Platforms": "$PLATFORMS",
        "UserData": "$USER_DATA",
        "ENV": "$ENV"
    },
    "K8S": {
        "YamlPath": "$YAML_PATH",
        "YamlDir": "$YAML_DIR",
        "Namespace": "$NAMESPACE",
        "ClusterName": "$CLUSTER"
    },
    "Config": {
        "VaultKVPath": "$VAULT_KV_PATH",
        "UserData": "$USER_DATA",
        "EventID": "",
    }
}
EOF

cat trigger.json

export EVENT_ID=`curl http://el-build-pipeline-listener.tekton-pipelines.svc.cluster.local:8080/v1/$PIPELINE \
    -d @trigger.json | jq -r '.eventID'`

echo Execution Logs: https://tekton.devops.umgapps.com/#/pipelineruns?labelSelector=triggers.tekton.dev%2Ftriggers-eventid%3D$EVENT_ID

tknwatch
