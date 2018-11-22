# @datalab/native

## Env
Copy `.env.example` to `.env.development`, `.env.staging` and `.env.production` and configure each one for DEV, STG and PROD settings respectively.

### Vars

#### `BACKEND_URL`
Url for @datalab backend service.

#### `LAN_HOST` (only for .env.development)
HOST address where local services are running. This is used to replace proxy services using `localhost` as URL host.

## Start
There are 3 current start scripts that init expo:
- `yarn start` => development
- `yarn start:staging` => staging
- `yarn start:production` => production
