// @ts-nocheck
/* eslint-disable */
import next from 'next';
import serverlessExpress from '@codegenie/serverless-express';
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


const serverlessServer = serverlessExpress({
  app: expressApp,
});

function lambdaHandler(event, context) {
  return nextJsApp.prepare().then(() => serverlessServer(event, context));
}

function exitProcessOnError(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('An error occurred, unable to handle the request');
      console.error(error);

      // Exit the process, forcing a lambda instance restart
      process.exit(1);
    }
  };
}

exports.handler = exitProcessOnError(lambdaHandler);
