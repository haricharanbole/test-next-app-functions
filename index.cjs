// @ts-nocheck
/* eslint-disable */
const next = require('next');
const serverlessExpress = require('@codegenie/serverless-express');
import createExpressApp from './app.js';

const port = 3000;
const nextJsApp = next({
  dir: '.',
  dev: process.env.NODE_ENV === 'development',
  // @ts-ignore
  xPoweredBy: false,
});

const nextJsRequestHandler = nextJsApp.getRequestHandler();
const expressApp = createExpressApp(nextJsRequestHandler);

expressApp.disable('x-powered-by');

console.log(process.env.NODE_ENV)


if (process.env.NODE_ENV === 'development') {
  nextJsApp.prepare().then(
    () => {
      expressApp.listen(port, (/** @type {any} */ err) => {
        if (err) {
          throw err;
        }

        console.log(`> Ready on port ${port}`);
      });
    },
    (error) => {
      console.error('An error occurred, unable to start the server');
      console.error(error);
    },
  );
} else {

  const cachedServerlessExpress = serverlessExpress({ app: expressApp })

  module.exports = async function (context, req) {
    return cachedServerlessExpress(context, req)
  }
}
