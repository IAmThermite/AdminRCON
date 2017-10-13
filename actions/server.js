const Rcon = require('srcds-rcon');

exports.run = (server) => {
  return new Promise((fufill, reject) => {
    server.connect().then(() => {
      server.command('sv_password').then((output) => {
        if(output !== '') {
          try {
            const pass = output.slice(output.indexOf('"sv_password"'), output.length).replace(' - Server password for entry into multiplayer games', '').replace('notify', '').replace('\n', '');
            const array = pass.replace(/"/g, '').split(' = ');
  
            fufill(array[1].slice(0, array[1].indexOf('(')).trim());
          } catch(e) {
            reject(undefined);
          }
        } else {
          reject(undefined);
        }
        server.disconnect();
      }).catch((e) => {
        reject(undefined);
      });
    }).catch((e) => {
      reject(undefined);
    });
  });
};
