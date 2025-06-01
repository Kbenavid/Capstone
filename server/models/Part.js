const mongoose = require('mongoose');// imports mongoose library to create schemas and interact with mongodb
const partSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: {type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    barcode: { type: String, required: true, unique: true },
}, { timestamps: true });
// defines mongoose schema for the part collection with fields name, quantity, price, and barcode
module.exports = mongoose.model('Part', partSchema); // exports the part model based on schema allows to import part model in other files.