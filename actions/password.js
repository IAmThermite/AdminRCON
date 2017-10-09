exports.run = (server, body, res, req) => {
  server.connect().then(() => {
    server.command(`sv_password ${body.password}`).then((output) => {
      res.render('password', {
        title: 'Change Server Password',
        server: req.session.server,
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
