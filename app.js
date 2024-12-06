import express from 'express'; 

/**
 * @param {import("next/dist/server/next").RequestHandler} nextJsRequestHandler
 */
export default function createExpressApp(nextJsRequestHandler) {

  const app = express();

  app.get('*', (req, res) => {
    return nextJsRequestHandler(req, res);
  });

  return app;
};
