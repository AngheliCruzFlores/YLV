const mongoose = require('mongoose');
const { APP_MONGODB_HOST, APP_MONGODB_DATABASE } = process.env;
const MONGODB_URI = `mongodb://${APP_MONGODB_HOST}/${APP_MONGODB_DATABASE}`;
    
mongoose.connect(MONGODB_URI, {
})
  .then(() => {
    console.log('Conexión establecida a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });