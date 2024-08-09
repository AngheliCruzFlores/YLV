const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const socketIo = require('socket.io');
const { saveMessage } = require('./controllers/chat.controller');
const Nota = require('./models/Nota');

// Inicializaciones
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
require('./config/passport')

// Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  helpers: {
    ifCond: function (v1, v2, options) {
      if (v1.toString() === v2.toString()) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Variables Globales
app.use((req, res, next) => {
  res.locals.succ_msg = req.flash('succ_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Rutas
app.use(require('./routes/index.routes'));
app.use(require('./routes/users.routes'));
app.use(require('./routes/notes.routes'));
app.use(require('./routes/chat.routes'));

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  // Chat messages
  socket.on('join', ({ senderId, receiverId }) => {
    socket.join([senderId, receiverId]);
  }); 
  socket.on('chat message', async ({ senderId, receiverId, message }) => {
    await saveMessage(senderId, receiverId, message);
    io.to(senderId).to(receiverId).emit('chat message', { senderId, receiverId, message });
  });
  // Notas
  socket.on('joinNote', (noteId) => {
    console.log(`Cliente se ha unido a la sala de la nota: ${noteId}`);
    socket.join(noteId);
  });
  socket.on('editNote', async ({ noteId, titulo, descripcion }) => {
    try {
      const note = await Nota.findById(noteId);
      if (note) {
        note.titulo = titulo;
        note.descripcion = descripcion;
        await note.save();
        console.log(`Nota actualizada: ${noteId} - ${titulo}`);
        io.to(noteId).emit('noteUpdated', { id: note._id, titulo, descripcion });
      }
    } catch (error) {
      console.error('Error al editar la nota:', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).render('404');
});

module.exports = { app, server };