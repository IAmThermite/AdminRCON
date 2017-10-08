const express = require('express');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const session = require('cookie-session');
const config = reqire('config');
const rcon = require('srcds-rcon');

const app = express();

// APP SETUP \\
app.set('trust proxy', 1);
app.use(cookieSession({
  name: 'session',
  secret: config.get('session.session-secret'),
  maxAge: config.get('session.cookie-maxage'),
}));

app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.static('public'));


// APP GET ROUTES \\
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/maps', (req, res) => {
  if(req.session.server) {
    res.render('maps', {
      server: req.session.server,
      mapList: config.get('maps'),
    });
  }
});

app.get('/configs', (req, res) => {
  if(req.session.server) {
    res.render('configs', {
      server: req.session.server,
      configList: config.get('configs'),
    });
  }
});

app.get('/password', (req, res) => {
  if(req.session.server) {
    res.render('password', {
      server: req.session.server,
    });
  }
});

app.get('/players', (req, res) => {
  if(req.session.server) {
    // get the formatted players list from `status` command
    res.render('players', {
      server: req.session.server,
      playerList: '',
    });
  }
});

app.get('/command', (req, res) => {
  if(req.session.server) {
    res.render('command', {
      server: req.session.server,
      commonComands: config.get('common-commands'),
    });
  }
});

app.get('/help', (req, res) => {
  res.render('help', {});
});


// APP POST ROUTES \\
app.post('/server', (req, res) => {
  if(req.body.server) {
    req.session.server = req.body.server;
    res.redirect('/');
  } else {
    res.render('400', {
      code: '400',
      error: 'No server found',
    });
  }
});

app.post('execute', (req, res) => {
  // execute command, if error go to 400 or 500
  // depending on error or go back to parent page
});


// START APP \\
app.listen(3000, () => {
  console.log('App running');
});