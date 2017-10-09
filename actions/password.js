exports.run = (server, body, res, req) => {
  server.command('status').then(output => {
    console.log(output);
      res.render('password', {
        title: 'Change Server Password',
        server: req.session.server,
        changed: true,
      });
  }).catch(err => {
    res.render('error', {
      code: 400,
      error: 'Invalid server details',
    });
  });
};
