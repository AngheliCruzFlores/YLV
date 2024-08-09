const { Schema, model } = require('mongoose');

const NotaSchema = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shareId: { type: String, unique: true, sparse: true },
    usuarios: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

module.exports = model('Nota', NotaSchema);
