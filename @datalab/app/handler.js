//
// Copyright 2018 Wireline, Inc.
//
import url from 'url';
import 'source-map-support/register';

import Wireline from '@wirelineio/sdk';

export const index = Wireline.exec(async (event, context, response) => {
  const PUBLIC_PATH = process.env.WRL_PUBLIC_PATH || '';
  const localConfig = {
    rootId: 'ux-root',
    PUBLIC_PATH,
    BACKEND_ENDPOINT: context.wireline.services.backend.endpoint,
    NODE_ENV: process.env.NODE_ENV || 'development'
  };

  response.set('Content-Type', 'text/html');

  return `<!DOCTYPE>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      />
      <title>DataLab</title>
      <link rel="shortcut icon" href="${PUBLIC_PATH}/favicon.ico">
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    </head>
    <body>
      <div id="${localConfig.rootId}"></div>
      <script>window.config = ${JSON.stringify(localConfig)};</script>
      <script src="${PUBLIC_PATH}/assets/app.js"></script>
    </body>
    </html>
  `;
});

export const proxy = Wireline.exec(async (event, context, response) => {
  const { static_assets_url } = context.wireline;
  const match = event.path.match(/^\/assets\/(.*)/);
  let path = event.path;

  if (match) {
    path = match[1];
  }

  response
    .set('Location', url.resolve(static_assets_url, path))
    .status(301)
    .send('');
});
