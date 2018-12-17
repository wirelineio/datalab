# DataLab

A Wireline Demo

## Install Dependencies

`yarn`

## Deploy

### AWS

`./ops/deploy.sh --aws`

### OPEN FAAS

`./ops/deploy.sh --faas`

## Development

We are using `wire` to run the datalab stack locally. From the datalab root run:

```
$ wire dev stack --stack ./ops/fass/stack.yml --services . --endpoint https://dev.wireline.ninja/svc/registry

```

### Enable Debugging

In order to enable debugging we need to add `-d` param to `wire dev stack`:

```
$ wire dev stack -d --stack ./ops/fass/stack.yml --services . --endpoint https://dev.wireline.ninja/svc/registry

```

Then open a debugger (chrome://inspect) and attach all processes. 

> *Note*: If you run from *vscode* integrated terminal, you can activate `Auto Attach` and all process will be auto attached to their own debugger.

### Running with vscode

We provided a `launch.json` to include a set of configurations to facilitate running datalab locally:

- `stack: @datalab`: Run the entire stack and auto attach debug processes. It will use `ops/fass/stack.yml`
- `stack: @datalab-dev`: Run the entire stack with you own store from `ops/stack-dev.yml` (see next section)

### Use your own store deployemnt

Deploy `wireline.io/wireline/store` to your stack. We provide a `ops/dev/store/stack.yml` that you can use to set up your own domain.

- Modify `ops/dev/store/stack.yml` domain.
- Deploy your store `wire stack deploy --endpoint https://dev.wireline.ninja` from the `ops/dev/store` folder.
- Add a `./ops/stack-dev.yml` and set the store reference to your own deployment.

Run the `wire dev stack` using the `./ops/stack-dev.yml`.
