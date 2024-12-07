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

console.log(process.env.AZURE_FUNCTION_NAME)

const inFunction = !!process.env.AZURE_FUNCTION_NAME;

// This specifies which mime types should be sent as binary (base64) instead of utf-8-encoded.
// This only affects the way data is sent to the API Gateway. If this is not set for a particular
// mime type and gzip compression is used (which makes the content binary), then the API Gateway
// will not be able to correctly process the response.
//
// This is set here because Next.js compresses some assets automatically.
//
// The side-effect from this setting is that even plain-text / json content will be sent base64-encoded
// to the API Gateway but in any case the browser will receive the correct content representation.
// This only affects the Lambda <-> API Gateway communication.
const BINARY_MIME_TYPES = ['*/*'];

if (inFunction) {
  const cachedServerlessExpress = serverlessExpress({ app: expressApp })

  module.exports = async function (/** @type {any} */ context, /** @type {any} */ req) {
    return cachedServerlessExpress(context, req)
  }

} else {
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
}
