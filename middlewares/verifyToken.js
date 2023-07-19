const jwt = require('jsonwebtoken');
const KEY = process.env.TOKEN_KEY;

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorised request');
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    return res.status(401).send('Unauthorised request');
  }
  let payload = jwt.verify(token, KEY);
  if (!payload) {
    return res.status(401).send('Unauthorised request');
  }
  if (payload.subject) req.userId = payload.subject;
  else req.userId = payload.payload.subject;
  next();
}

module.exports = verifyToken;
