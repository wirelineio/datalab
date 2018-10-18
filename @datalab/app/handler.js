//
// Copyright 2018 Wireline, Inc.
//
import 'source-map-support/register';

import Wireline from '@wirelineio/sdk';

export const index = Wireline.exec(async (event, context, response) => {
  const localConfig = {
    rootId: 'ux-root'
  };

  response.set('Content-Type', 'text/html');
  // TODO: why I have to define /dev/assets/app.js ?
  return `<!DOCTYPE>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      />
      <title>Wireline Github App</title>
      <link rel="shortcut icon" href="./favicon.ico">
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    </head>
    <body>
      <div id="${localConfig.rootId}"></div>
      <script>window.config = ${JSON.stringify(localConfig)};</script>
      <script src="/dev/assets/app.js"></script>
    </body>
    </html>
  `;
});

export const proxy = Wireline.exec(async (event, context, response) => {
  const { static_assets_url } = context.wireline;
  const match = event.path.match(/^\/assets(\/.*)/);
  let path = event.path;

  if (match) {
    path = match[1];
  }

  response
    .set('Location', `${static_assets_url}${path}`)
    .status(301)
    .send('');
});
