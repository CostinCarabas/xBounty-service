## Description

[NestJS](https://github.com/nestjs/nest) Monorepo Template.

## Installation

```bash
$ yarn install
```

## Setup

```bash
# Docker Setup
$ docker-compose up -d

# API Config Setup
$ touch apps/api/src/config/config.yaml && cp ./apps/api/src/config/config.example.yaml ./apps/api/src/config/config.yaml

# Offline Jobs Config Setup
$ touch apps/offline-jobs/src/config/config.yaml && cp ./apps/offline-jobs/src/config/config.example.yaml ./apps/offline-jobs/src/config/config.yaml

# Typeorm Config Setup (for migrations)
$ touch typeorm.config.ts && cp ./typeorm.config.example.ts ./typeorm.config.ts
```

## Personalization

Replace all `@XBounty` occurences with your app name.

Replace all `x-bounty-app-db` occurences with your db name.

Replace `XBounty` from `microservice.configurator.ts` with your app name.

## Running the app

API

```bash
# development
$ yarn start:dev

# production mode
$ yarn start
```

Offline Jobs

```bash
# development
$ yarn start:offline-jobs:dev

# production mode
$ yarn start:offline-jobs
```

## Swagger

Swagger is on [/api-docs](http://localhost:3000/api-docs) endpoint of API instance.
