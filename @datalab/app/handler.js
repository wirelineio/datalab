//
// Copyright 2018 Wireline, Inc.
//
import url from 'url';
import 'source-map-support/register';

import Wireline from '@wirelineio/sdk';
import { WireFetch } from '@wirelineio/sdk/dist/es/mesh/wirefetch';

export const index = Wireline.exec(async (event, context, response) => {
  const PUBLIC_PATH = ensureNoEndSlash(process.env.WRL_PUBLIC_PATH) || '';
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
      <link rel="shortcut icon" href="${PUBLIC_PATH}/assets/favicon.ico">
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
      <style>
         body {
          margin: 0;
         }
         #needwallet {
           font-family: "Roboto", "Helvetica", "Arial", sans-serif;
           font-size: 1.00rem;
           letter-spacing: 0.0075em;
           color: #444;
         }
         #needwallet #banner {
           background-color: #3f51b5;
           margin: 0;
           color: #fff;
           font-size: 1.25rem;
           font-weight: 500;
           line-height: 1.6;
           padding: 1em;
         }
         #needwallet h1 {
           font-size: 1.25rem;
           font-weight: 500;
           line-height: 1.6;
         }
         #needwallet a {
          text-decoration: none;
         }
         #needwallet p {
          padding-top: 0.5em;
         }
      </style>
      
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <script>
        function detectWallet(onYes, onNo) {
          if ($('#wirelineExtensionIsPresent').length) {
            if (onYes) {
              onYes();
            }
          } else {
            if (onNo) {
              onNo();
            }
          }
        }

        function addApp() {
          $('#needwallet').remove();
          $('body').append('<script src="${PUBLIC_PATH}/assets/app.js"></'+'script>');
        }
      </script>
    </head>
    <body onload='detectWallet(addApp);'>
      <div id="needwallet">
        <div id="banner">DataLab</div>
          <div style="padding: 1em">
           <h1>Wireline Wallet Required</h1>
           <p>To login, you must first install the <a href="https://github.com/wirelineio/experimental/tree/master/sub/wallet/extension">Wireline Wallet</a>
           browser extension.</p>
           <p><a href="https://github.com/wirelineio/experimental/tree/master/sub/wallet/extension">What is the Wireline Wallet?</a></p>
          </div>
      </div>
      <div id="${localConfig.rootId}"></div>
      <script>window.config = ${JSON.stringify(localConfig)};</script>
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
    .set('Location', url.resolve(ensureEndSlash(static_assets_url), path))
    .status(301)
    .send('');
});

export const gql = Wireline.exec(async (event, context, response) => {
  let fetch = new WireFetch();

  let url = `${context.wireline.services.backend.endpoint}/gql`;
  let opts = {
    headers: event.headers
  };

  let result = await fetch.post(url, event.body, opts);

  result.headers.forEach((v, k) => {
    response.set(k, v);
  });

  response.status(result.status);
  let json = await result.json();

  response.send(json);
});

const ensureEndSlash = path => {
  if (!path || typeof path !== 'string') return path;
  if (!path.endsWith('/')) return `${path}/`;
  return path;
};

const ensureNoEndSlash = path => {
  if (!path || typeof path !== 'string') return path;
  if (path.endsWith('/')) return path.substr(path, path.length - 1);
  return path;
};
