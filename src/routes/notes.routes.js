const { Router } = require('express');
const router = Router();
const {
    renderNotFor,
    crearNota,
    obtNota,
    editNota,
    updateNota,
    borrarNota,
    shareNote,
    addUserToNote,
    getSharedNote
} = require('../controllers/notes.controller');
const { isAuthenticated } = require('../helpers/auth');

// Crear notas
router.get('/notes/add', isAuthenticated, renderNotFor);
router.post('/notas/nueva-nota', isAuthenticated, crearNota);

// Obtener notas
router.get('/notes', isAuthenticated, obtNota);

// Editar notas
router.get('/notes/edit/:id', isAuthenticated, editNota);
router.put('/notes/edit/:id', isAuthenticated, updateNota);

// Eliminar notas
router.delete('/notes/delete/:id', isAuthenticated, borrarNota);

// Compartir nota
router.get('/notes/share/:id', isAuthenticated, shareNote);
router.post('/notes/share/:id', isAuthenticated, addUserToNote);
router.get('/notes/shared/:shareId', isAuthenticated, getSharedNote);

module.exports = router;
