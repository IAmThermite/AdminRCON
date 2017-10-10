const config = require('config');

exports.run = (server, body, res, req) => {
  server.connect().then(() => {
    server.command(`${body.command}`).then((output) => {
      const index = output.indexOf('Unknown');
      if(index === -1) { // successful command?
        if(output === '') { // no
          res.render('error', {
            code: 400,
            error: 'Invalid server details',
            full: 'Invalid RCON password',
          });
        } else { // yes
          res.render('command', {
            title: 'Execute a command',
            server: req.session.server,
            commandList: config.get('common-commands'),
            changed: true,
            error: false,
          });
        }
      } else { // invalid command
        res.render('command', {
          title: 'Execute a command',
          server: req.session.server,
          commandList: config.get('common-commands'),
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
