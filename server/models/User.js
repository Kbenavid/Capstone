const mongoose = require('mongoose'); //imports mongoose library to create schemas and interact with mongodb
const bcrypt = require('bcryptjs'); //imports the bcryptjs library to securely hash passwords and compare them later.
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash:{ type: String, required: true },
}); // defines mongoose schema for the user collection 
userSchema.methods.setPassword = async function(password) {
    this.passwordHash = await bcrypt.has(password, 10);
} // adds a custom instance method to the user schema, takes plain password, hashes it using bcrypt with 10 salt rounds and sets the hashed password to the user document.
userSchema.methods.validatePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash); //  adds another instance method, compatrs a plain password with the stored hashed password. returns true if hashed password matches the stored hash, false otherwise.
}
module.exports = mongoose.model('User', userSchema); 
    //exports the user model based on schema allows to import user model in other files.