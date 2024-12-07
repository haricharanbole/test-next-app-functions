/* eslint-disable */
import serverlessExpress from '@codegenie/serverless-express';
import next from 'next';

import createExpressApp from './app.js'

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

  function finalExpress(/** @type {any} */ context, /** @type {any} */ req) {
    return cachedServerlessExpress(context, req)
  }
  finalExpress()
}
