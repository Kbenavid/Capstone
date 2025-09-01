require('dotenv').config();
const mongoose = require('mongoose');
const Part = require('../server/models/part');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const before = await Part.collection.indexes();
  console.log('Before indexes:', before);

  try {
    await Part.collection.dropIndex('barcode_1'); // ignore if doesn't exist
    console.log('Dropped old barcode_1 index (if existed)');
  } catch (e) {
    console.log('dropIndex note:', e.message);
  }

  await Part.syncIndexes();

  const after = await Part.collection.indexes();
  console.log('After indexes:', after);

  await mongoose.disconnect();
  process.exit(0);
})();