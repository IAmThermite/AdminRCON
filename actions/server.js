const Rcon = require('srcds-rcon');
const config = require('config');

exports.run = (server) => {
  if(server !== undefined) {
    server.connect().then(() => {
      server.command('sv_password').then((output) => {
        if(output !== '') {
          const pass = output.slice(output.indexOf('"sv_password"'), output.length).replace(' - Server password for entry into multiplayer games', '');
          console.log(pass);

          const array = pass.replace(/["']/g, '').split(' = ');
          console.log(array[1]);
          return array[1].trim();
        } else {
          return undefined;
        }
      }).catch((e) => {
        return undefined;
      });
    }).catch((e) => {
      return undefined;
    });
  }
};
