const config = require('config');

exports.run = (server, body, res, req) => {
  server.connect().then(() => {
    server.command(`exec ${body.config}`).then((output) => {
      console.log(output);
      const index1 = output.indexOf(' not present; not executing.'); // no cfg
      const index2 = output.indexOf('exec <filename>: execute a script file'); // invalid args
      if(index1 === -1 && index2 === -1) { // executed
        if(output === '') { // rcon failed
          res.render('error', {
            code: 400,
            error: 'Invalid server details',
            full: 'Invalid RCON password',
          });
        } else {
          res.render('configs', {
            title: 'Execute a config',
            server: req.session.server,
            configList: config.get('configs'),
            changed: true,
            error: false,
          });
        }
      } else {
        res.render('configs', {
          title: 'Execute a config',
          server: req.session.server,
          configList: config.get('configs'),
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
