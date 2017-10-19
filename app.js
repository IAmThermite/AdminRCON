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

// METHODS
const getServerFromString = (string, res) =>  {
  const parts = string.split('; '); // divide

  var array = [];
  try {
    for(var i = 0; i < 3; i++) {
      array.push(parts[i].slice(parts[i].indexOf(' '), parts[i].length).replace(/"/g, '').trim());
    }
    return array;
  } catch(e) {
    res.render('error', {
      code: 400,
      error: 'Invalid connect string! Format: connect <hostname>; password <password>; rcon_password <rcon_password>',
      full: e,
    });
  }
}

const getServerPassword = (req) => {
  return new Promise((fufill, reject) => {
    if(req.session.server !== undefined) {
      var server = Rcon({
        address: `${req.session.server.address}`,
        password: `${req.session.server.rcon}`,
      });
      
      const serverInfo = require('./actions/server.js');
      const output = serverInfo.run(server);
      if(output !== undefined) {
        fufill(output);
      } else {
        reject(undefined);
      }
    } else {
      reject(undefined);
    }
  });
}

// APP GET ROUTES
app.get('/', (req, res) => {
  res.render('index', {
    title: config.get('app-name'),
    server: req.session.server || undefined,
  });
});

app.get('/server', (req, res) => {
  getServerPassword(req).then((output) => {
    res.render('server', {
      title: 'Server Settings',
      server: req.session.server || undefined,
      password: output,
    });
  }).catch((e) => {
    res.render('server', {
      title: 'Server Settings',
      server: req.session.server || undefined,
      password: undefined,
    });
  });
});

app.get('/maps', (req, res) => {
  if(req.session.server) {
    res.render('maps', {
      title: 'Change the Map',
      server: req.session.server,
      gamemodes: config.get('gamemodes'),
      mapList: config.get('maps'),
      changed: false,
      error: false,
    });
  } else {
    res.redirect('/server');
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
  } else {
    res.redirect('/server');
  }
});

app.get('/password', (req, res) => {
  if(req.session.server) {
    getServerPassword(req).then((output) => {
      res.render('password', {
        title: 'Change Server Password',
        server: req.session.server,
        changed: false,
        password: output,
      });
    }).catch((e) => {
      res.render('password', {
        title: 'Change Server Password',
        server: req.session.server,
        changed: false,
        password: undefined,
      });
    });
  } else {
    res.redirect('/server');
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
  } else {
    res.redirect('/server');
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
  } else {
    res.redirect('/server');
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
  if(req.body.address !== undefined && req.body.address !== '') {
    req.session.server = {
      address: req.body.address,
      rcon: req.body.password || '',
    };
    res.redirect('/');
  } else if(req.body.string !== undefined && req.body.string !== '') { // generate string parameters
    const string = getServerFromString(req.body.string);
    req.session.server = {
      address: string[0],
      rcon: string[2],
    }
    res.redirect('/');
  } else {
    res.render('error', {
      code: 400,
      error: 'Please enter an IP',
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
        full: e,
      });
    }
    server.disconnect();
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
