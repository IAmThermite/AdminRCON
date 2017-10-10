const express = require('express');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const session = require('cookie-session');
const config = require('config');
const Rcon = require('srcds-rcon');

const app = express();

// APP SETUP
app.set('trust proxy', 1);
app.use(session({
  name: config.get('session.name'),
  secret: config.get('session.secret'),
  maxAge: config.get('session.cookie-maxage'),
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.use(express.static('public'));


// APP GET ROUTES
app.get('/', (req, res) => {
  res.render('index', {
    title: config.get('app-name'),
    server: req.session.server || undefined,
  });
});

app.get('/server', (req, res) => {
  res.render('server', {
    title: config.get('app-name'),
    server: req.session.server || undefined,
  });
});

app.get('/maps', (req, res) => {
  if(req.session.server) {
    res.render('maps', {
      title: 'Change the Map',
      server: req.session.server,
      mapList: config.get('maps'),
      changed: false,
      error: false,
    });
  }
});

app.get('/configs', (req, res) => {
  if(req.session.server) {
    res.render('configs', {
      title: 'Execute a config',
      server: req.session.server,
      configList: config.get('configs'),
      changed: false,
      error: false,
    });
  }
});

app.get('/password', (req, res) => {
  if(req.session.server) {
    res.render('password', {
      title: 'Change Server Password',
      server: req.session.server,
      changed: false,
    });
  }
});

app.get('/players', (req, res) => {
  if(req.session.server) {
    // get the formatted players list from `status` command
    res.render('players', {
      title: 'Manage Players on Server',
      server: req.session.server,
      playerList: '',
    });
  }
});

app.get('/command', (req, res) => {
  if(req.session.server) {
    res.render('command', {
      title: 'Execute a command',
      server: req.session.server,
      commandList: config.get('common-commands'),
      changed: false,
    });
  }
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    server: req.session.server || undefined,
  });
});

app.get('/clear', (req, res) => {
  req.session = null;
  res.redirect('/');
});


// APP POST ROUTES
app.post('/server', (req, res) => {
  if(req.body.address) {
    req.session.server = {
      address: req.body.address,
      rcon: req.body.password,
    };
    res.redirect('/');
  } else if(req.body.string) { // generate string parameters
    req.session.server = {
      address: '',
      rcon: '',
    }
  } else {
    res.render('error', {
      code: '400',
      error: 'No server found',
      full: ''
    });
  }
});

app.post('/execute', (req, res) => {
  var server = Rcon({
    address: `${req.session.server.address}`,
    password: `${req.session.server.rcon}`,
  });
  
  server.connect().then(() => {
    try { // try and find the required action file
      var action = require(`./actions/${req.body.action}.js`);
      action.run(server, req.body, res, req); // run the command file
    } catch(e) { // file not found
      res.render('error', {
        code: 500,
        error: 'Internal Server Error. Contact developer.',
      });
    }
  }).catch((e) => { // cant connect to server
    res.render('error', {
      code: 400,
      error: 'Invalid server details',
      full: e,
    });
  });
});


// START APP
app.listen(3000, () => {
  console.log('App running');
});
