const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    profilePicture: { type: String }
}, {
    timestamps: true
});

UserSchema.methods.encryptPassword = async pass => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
};

UserSchema.methods.matchPass = async function(pass) {
    return await bcrypt.compare(pass, this.pass);
}

module.exports = model('Usuarios', UserSchema);
