exports.run = (server, body, res, req) => {
  if(!body.password || body.password === undefined) {
    body.password = '\"\"';
  }
  server.connect().then(() => {
    server.command(`sv_password ${body.password}`).then((output) => {
      const index = output.indexOf('server_cvar:');
      if(index === -1) { // something went wrong
        res.render('error', {
          code: 400,
          error: 'Invalid server details',
          full: 'Invalid RCON password',
        });
      } else {
        res.render('password', {// password changed
          title: 'Change Server Password',
          server: req.session.server,
          changed: true,
          error: false,
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
