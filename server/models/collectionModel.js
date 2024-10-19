const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: String,
  approvedFiles: [
    {
      fileName: String,
      filePath: String,
      approved: Boolean,
    }
  ],
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
