const { onRequest } = require('firebase-functions/v2/https');
  const server = import('firebase-frameworks');
  exports.ssrfridaycake259cc = onRequest({"region":"europe-west1"}, (req, res) => server.then(it => it.handle(req, res)));
  