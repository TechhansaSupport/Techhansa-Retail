const mongoose = require('mongoose');

const techhansaCatalogSchema = new mongoose.Schema({
  catalogId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  specs: { type: String },
  b2bPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TechhansaCatalog', techhansaCatalogSchema);
