#!/usr/bin/env bash

__DIRNAME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

_ENDPOINT_AWS=https://api.wireline.ninja
_ENDPOINT_FAAS=https://faas-prod.wireline.ninja/svc/registry

# aws | faas 
PLATFORM="faas"
ENDPOINT=
DOMAIN=example.com

set -e

die() {
  printf '%s\n' "$1" >&2
  exit 1
}

pushd () {
  command pushd "$@" > /dev/null
}

popd () {
  command popd "$@" > /dev/null
}

while :; do
  case $1 in

    -d|--domain)       # Takes an option argument; ensure it has been specified.
      if [ "$2" ]; then
        DOMAIN="$2"
        shift
      else
        die 'ERROR: "--domain" requires a non-empty option argument.'
      fi
      ;;
    -d|--domain=?*)
      DOMAIN=${1#*=} # Delete everything up to "=" and assign the remainder.
      ;;
    -d|--domain=)         # Handle the case of an empty --domain=
      die 'ERROR: "--domain" requires a non-empty option argument.'
      ;;

    -e|--endpoint)       # Takes an option argument; ensure it has been specified.
      if [ "$2" ]; then
        ENDPOINT="$2"
        shift
      else
        die 'ERROR: "--endpoint" requires a non-empty option argument.'
      fi
      ;;
    -e|--endpoint=?*)
      ENDPOINT=${1#*=} # Delete everything up to "=" and assign the remainder.
      ;;
    -e|--endpoint=)         # Handle the case of an empty --endpoint=
      die 'ERROR: "--endpoint" requires a non-empty option argument.'
      ;;

    -p|--platform)       # Takes an option argument; ensure it has been specified.
      if [ "$2" ]; then
        PLATFORM="$2"
        shift
      else
        die 'ERROR: "--platform" requires a non-empty option argument.'
      fi
      ;;
    -p|--platform=?*)
      PLATFORM=${1#*=} # Delete everything up to "=" and assign the remainder.
      ;;
    -p|--platform=)         # Handle the case of an empty --platform=
      die 'ERROR: "--platform" requires a non-empty option argument.'
      ;;
    --faas)
      PLATFORM="faas"
      ;;
    --aws)
      PLATFORM="aws"
      ;;
    --)              # End of all options.
      shift
      break
      ;;
    -?*)
      printf 'WARN: Unknown option (ignored): %s\n' "$1" >&2
      ;;
    *)               # Default case: No more options, so break out of the loop.
      break
  esac

  shift
done


if [ -z "${ENDPOINT}" ]; then  
  case $PLATFORM in
    aws)
      ENDPOINT=${_ENDPOINT_AWS}
      ;;
    *)
      ENDPOINT=${_ENDPOINT_FAAS}
     ;;
  esac
fi

echo "PLATFORM: ${PLATFORM}"
echo "DOMAIN: ${DOMAIN}"
echo "ENDPOINT: ${ENDPOINT}"

# Build
yarn lerna run build --parallel

# Register
yarn lerna exec -- -- wire service register --domain $DOMAIN --endpoint $ENDPOINT

# Upload Assets

yarn lerna exec -- --scope="@datalab/app" -- wire service upload-assets --domain $DOMAIN --endpoint $ENDPOINT

# Deploy

pushd "${__DIRNAME}/${PLATFORM}"
yarn exec --cwd .  wire -- stack deploy --endpoint $ENDPOINT
popd
