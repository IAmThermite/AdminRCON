const config = require('config');

exports.run = (server, body, res, req) => {
  server.connect().then(() => {
    server.command(`changelevel ${body.mapname}`).then((output) => {
      const index = output.indexOf('Failed');
      if(index === -1) { // failed map change
        if(output !== '') { // error
          res.render('error', {
            code: 400,
            error: 'Invalid server details',
            full: 'Invalid RCON password',
          });
        } else { // map changed
          res.render('maps', {
            title: 'Change the Map',
            server: req.session.server,
            gamemodes: config.get('gamemodes'),
            mapList: config.get('maps'),
            changed: true,
            error: false,
          });
        }
      } else { // map change sucessful
        res.render('maps', {
          title: 'Change the Map',
          server: req.session.server,
          gamemodes: config.get('gamemodes'),
          mapList: config.get('maps'),
          changed: true,
          error: true,
        });
      }
      server.disconnect();
    }).catch((e) => {
      res.render('error', {
        code: 400,
        error: 'Cannot connect to server',
        full: e,
      });
    });
  }).catch((e) => { // cant connect to server
    res.render('error', {
      code: 400,
      error: 'Invalid server details',
      full: e,
    });
  });
};
