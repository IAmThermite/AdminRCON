const Rcon = require('srcds-rcon');
const config = require('config');

exports.run = (server) => {
  if(server !== undefined) {
    server.connect().then(() => {
      server.command('sv_password').then((output) => {
        if(output !== '') {
          const array = output.split(' = ').replace(/"/g );
          
          console.log(array);
          return array[1];
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
