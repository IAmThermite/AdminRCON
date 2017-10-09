const config = require('config');

exports.run = (server, body, res, req) => {
  server.connect().then(() => {
    server.command(`changelevel ${body.mapname}`).then((output) => {
      res.render('maps', {
        title: 'Change the Map',
        server: req.session.server,
        mapList: config.get('maps'),
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
