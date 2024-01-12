FROM node:20-alpine AS base

ARG SERVICE_PATH
ARG PACKAGE_NAME
ARG PNPM_VERSION=8.14.0
ARG SERVICE_PORT

# Install package manager
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    npm i --global --no-update-notifier --no-fund pnpm@${PNPM_VERSION}

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    npm i -g typescript

USER node

FROM base AS dependencies

WORKDIR /usr/app

COPY --chown=node pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY --chown=node ./libs ./libs
COPY --chown=node ${SERVICE_PATH}/package.json ./${SERVICE_PATH}/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm build:packages \
    | grep -v "cross-device link not permitted\|Falling back to copying packages from store"

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --no-frozen-lockfile --filter ${PACKAGE_NAME}\
    | grep -v "cross-device link not permitted\|Falling back to copying packages from store"

FROM dependencies AS build

WORKDIR /usr/app

COPY --chown=node:node ${SERVICE_PATH} ./${SERVICE_PATH}

ENV NODE_ENV=production
RUN pnpm --filter ${PACKAGE_NAME} build
RUN rm -rf node_modules src && pnpm -r exec -- rm -rf node_modules

FROM base AS release

WORKDIR /usr/app

ENV NODE_ENV=production

COPY --chown=node:node --from=build /usr/app .
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --filter ${PACKAGE_NAME} --prod \
    | grep -v "cross-device link not permitted\|Falling back to copying packages from store"

ENV EXEC_PATH=${SERVICE_PATH}/dist/index.js

EXPOSE ${SERVICE_PORT}

CMD pnpm start
