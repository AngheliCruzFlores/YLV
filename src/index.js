require('dotenv').config();

const { app, server } = require('./server');
require('./database');

server.listen(app.get('port'), () => {
  console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});
