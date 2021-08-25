FROM node:14-alpine as build-image
ENV APP_DIR /usr/app

# build client
WORKDIR ${APP_DIR}/client
COPY client/package.json package.json
COPY client/package-lock.json package-lock.json
COPY client/.npmrc .npmrc
RUN npm install
COPY client .
RUN  npm run build

# build server
WORKDIR ${APP_DIR}/server
COPY server .
RUN npm install --only=production && \
    cp -R node_modules prod_node_modules && \
    npm install && \
    npm run build && \
    npm run test-ci
ARG build
LABEL build=${build}
LABEL image=test
RUN cp -R ./reports ${APP_DIR}/reports

# release
FROM node:14-alpine
RUN apk add --update --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
ENV APP_DIR /usr/app
WORKDIR ${APP_DIR}
COPY --from=build-image ${APP_DIR}/server/prod_node_modules ./node_modules
COPY --from=build-image ${APP_DIR}/server/build .
COPY --from=build-image ${APP_DIR}/client/build ./client
RUN find . -name __test__ -type d -exec rm -r {} + 
USER node
CMD ["node","CuttingRoomProductionProcessApplication.js"]