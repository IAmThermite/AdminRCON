const config = require('config');

exports.run = (server, body, res, req) => {
  server.connect().then(() => {
    server.command(`${body.command}`).then((output) => {
      res.render('command', {
        title: 'Execute a command',
        server: req.session.server,
        commonComands: config.get('common-commands'),
        changed: true,
      });
    }).catch((e) => {
      res.render('error', {
        code: 400,
        error: 'Cannot connect to server',
      });
    });
    server.disconnect();
  }).catch((e) => { // cant connect to server
    res.render('error', {
      code: 400,
      error: 'Invalid server details',
    });
  });
};
