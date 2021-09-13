# FROM node:12.13-alpine As development

# # Create a directory (to house our source files) and navigate to it.
# WORKDIR /src

# # Installing dockerize which can test and wait on the availability of a TCP host and port.
# ENV DOCKERIZE_VERSION v0.6.1
# RUN apk add --no-cache openssl \
#     && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# # Installing bash.
# RUN apk add --no-cache bash bash-doc bash-completion

# # Copy over the package.json and lock file to the containers working directory.


# # Install build dependencies (required for node-gyp), install packages then delete build dependencies.
# # This is all done in the same command / layer so when it caches, it won't bloat the image size.
# RUN apk add --no-cache --virtual .gyp \
#         python \
#         make \
#         g++ \
#     && apk del .gyp
# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=development
# COPY . .
# RUN npm run build

# # Copy everything in the host folder into the working folder of the container.
# # COPY ./src /src/

# # Expose the specified port back to the host machine.
# EXPOSE 3000

FROM node:12.13-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:12.13-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
EXPOSE 3030