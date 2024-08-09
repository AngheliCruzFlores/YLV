const notesCtrl = {};
const { v4: uuidv4 } = require('uuid');
const Nota = require('../models/Nota');

notesCtrl.renderNotFor = (req, res) => {
    res.render('notas/nueva-nota');
};

notesCtrl.crearNota = async (req, res) => {
    const { titulo, descripcion } = req.body;
    const newNota = new Nota({ titulo, descripcion, usuario: req.user.id });
    await newNota.save();
    req.flash('succ_msg', 'Nota añadida con éxito');
    res.redirect('/notes');
};

notesCtrl.obtNota = async (req, res) => {
    const FNotas = await Nota.find({
        $or: [
            { usuario: req.user.id },
            { usuarios: req.user.id }
        ]
    }).sort({ createdAt: 'desc' });
    res.render('notas/fullnotes', { FNotas });
};

notesCtrl.editNota = async (req, res) => {
    const note = await Nota.findById(req.params.id);
    if (!note.usuarios.includes(req.user.id) && note.usuario.toString() !== req.user.id.toString()) {
        req.flash('error_msg', 'No está autorizado');
        return res.redirect('/notes');
    }
    res.render('notas/editnote', { note });
};


notesCtrl.updateNota = async (req, res) => {
    const { titulo, descripcion } = req.body;
    await Nota.findByIdAndUpdate(req.params.id, { titulo, descripcion });
    req.flash('succ_msg', 'Nota actualizada correctamente');
    res.redirect('/notes');
};

notesCtrl.borrarNota = async (req, res) => {
    await Nota.findByIdAndDelete(req.params.id);
    req.flash('succ_msg', 'Nota eliminada exitosamente');
    res.redirect('/notes');
};

// COMPARTIR NOTAS
notesCtrl.shareNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const shareId = uuidv4();
        const shareLink = `${req.protocol}://${req.get('host')}/notes/shared/${shareId}`;
        await Nota.findByIdAndUpdate(noteId, { shareId });
        req.flash('succ_msg', `Enlace para compartir: ${shareLink}`);
        res.redirect('/notes');
    } catch (error) {
        console.error('Error al compartir la nota:', error);
        req.flash('error_msg', 'Error al compartir la nota');
        res.redirect('/notes');
    }
};

notesCtrl.getSharedNote = async (req, res) => {
    try {
        const shareId = req.params.shareId;
        const note = await Nota.findOne({ shareId });
        if (!note) {
            req.flash('error_msg', 'Nota no encontrada');
            return res.redirect('/notes');
        }
        if (!note.usuarios.includes(req.user.id) && note.usuario.toString() !== req.user.id.toString()) {
            note.usuarios.push(req.user.id);
            await note.save();
        }
        res.render('notas/editnote', { note });
    } catch (error) {
        console.error('Error al obtener la nota compartida:', error);
        req.flash('error_msg', 'Error al obtener la nota compartida');
        res.redirect('/notes');
    }
};

// Añadir usuarios a la nota compartida
notesCtrl.addUserToNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const { userId } = req.body;
        const note = await Nota.findById(noteId);
        if (!note.usuarios.includes(userId)) {
            note.usuarios.push(userId);
            await note.save();
        }
        req.flash('succ_msg', 'Usuario añadido exitosamente');
        res.redirect(`/notes/edit/${noteId}`);
    } catch (error) {
        console.error('Error al añadir usuario a la nota:', error);
        req.flash('error_msg', 'Error al añadir usuario a la nota');
        res.redirect(`/notes/edit/${noteId}`);
    }
};

module.exports = notesCtrl;