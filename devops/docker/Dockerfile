FROM node:17.4.0 as builder

ARG USER_DATA
ARG ENV
ARG ENVIRONMENT
 
RUN echo “hello ${USER_DATA}”
RUN echo ENVIRONMENT ENV ===============================”


WORKDIR /src

RUN apt-get update -y && apt-get install -y jq

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --immutable
COPY . .
RUN npm run build

# RUN --mount=type=secret,id=serviceaccount_token,target=/var/run/secrets/kubernetes.io/serviceaccount/token \
    # bash ./devops/scripts/buildwithvault.sh

FROM nginx:1.17 as web

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /src/build/ /usr/share/nginx/html/
