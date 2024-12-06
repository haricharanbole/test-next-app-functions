import express from 'express'; 

export default function createExpressApp(nextJsRequestHandler) {

  const app = express();

  app.get('*', (req, res) => {
    return nextJsRequestHandler(req, res);
  });

  return app;
};
