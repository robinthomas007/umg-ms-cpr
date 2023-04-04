FROM node:17.4.0 as builder

ARG USER_DATA
ENV USER_DATA $USER_DATA

ARG ENV
ENV ENV $ENV

ARG ENVIRONMENT
ENV ENVIRONMENT $ENVIRONMENT

WORKDIR /src


RUN echo "USER_DATA =======================USER_DATA in docker"
RUN echo $USER_DATA

echo "env =======================in docker"
echo $ENV

echo "environment =======================in docker"
echo $ENVIRONMENT

RUN apt-get update -y && apt-get install -y jq

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --immutable
COPY . .

RUN bash ./devops/scripts/environment.sh

RUN npm run build:dev

FROM nginx:1.17 as web

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /src/build/ /usr/share/nginx/html/
