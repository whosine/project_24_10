const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const {
  createCollection,
  getAllCollections,
  deleteCollection,
  addSectionToCollection,
  deleteSectionFromCollection,
  updateSectionInCollection
} = require('../controllers/collectionController');

const router = express.Router();

router.post('/', upload.array('files'), createCollection);
router.get('/', getAllCollections);
router.delete('/:id', deleteCollection);
router.post('/:id/sections', addSectionToCollection);
router.delete('/:id/sections/:sectionId', deleteSectionFromCollection);
router.put('/:id/sections/:sectionId', updateSectionInCollection);

module.exports = router;
