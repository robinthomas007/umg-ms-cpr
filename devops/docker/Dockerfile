FROM node:17.4.0 as builder

ARG USER_DATA

WORKDIR /src

RUN apt-get update -y && apt-get install -y jq

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --immutable
COPY . .

RUN bash ./devops/scripts/buildwithenv.sh 

FROM nginx:1.17 as web

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /src/build/ /usr/share/nginx/html/
