# Wireline Service Template.


## Setup

### CLI

See https://github.com/wirelineio/darkstar/blob/master/%40wirelineio/cli/README.md for CLI and access key setup instructions.

### Create project

- using git:

```bash
git clone --depth=1 git@github.com:wirelineio/graphql-service-template.git <service name>
cd <service name>
rm -rf .git
```
- using CLI:

```bash
wire create --template="https://github.com/wirelineio/graphql-service-template" --path="<service name>"
cd <service name>
```

### Install Packages

```bash
yarn install
```

### Change service.yml and stack.yml

Edit service.yml and stack.yml and change the service and stack names.

## Service Register

```bash
$ wire build
```

```bash
$ wire service register --domain example.com

Domain           Name                            Version         Content Hash                                                            Versions
---------------------------------------------------------------------------------------------------------------------------------------------------
example.com      graphql-service-template                0.0.1           52cdbe12f3119fb929edccd5d3be5206a02b30665006ee21796e6720f3813bde
```

## Stack Deploy

```bash
$ wire stack deploy

Name                            Service                         Version         Status          Content Hash                                                            Endpoint
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
my-deployment                   wrn::graphql-service-template           0.0.1           IN_PROGRESS
```

```bash
$ wire stack deploy

Name                            Service                         Version         Status          Content Hash                                                            Endpoint
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
my-deployment                   wrn::graphql-service-template           0.0.1           DONE                                                                                    https://1k06alat20.execute-api.us-east-1.amazonaws.com/dev
```

## Test Endpoint `gql`

```bash
$ curl -s -X POST -d '{ "query": "query QueryNodes { nodes: queryNodes { name } }" }'
https://1k06alat20.execute-api.us-east-1.amazonaws.com/dev/gql | jq
{
  "data": {
    "nodes": [
      {
        "name": "Hello World",
        "__typename": "Node"
      }
    ]
  }
}

```


