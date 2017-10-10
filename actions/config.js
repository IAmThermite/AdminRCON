const config = require('config');

exports.run = (server, body, res, req) => {
  server.connect().then(() => {
    server.command(`exec ${body.config}`).then((output) => {
      res.render('configs', {
        title: 'Execute a config',
        server: req.session.server,
        configList: config.get('configs'),
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
