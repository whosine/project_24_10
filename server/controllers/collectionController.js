const Collection = require('../models/collectionModel');
const fs = require('fs');

// Create new collection
const createCollection = async (req, res) => {
  const { name } = req.body;
  const files = req.files;

  try {
    const approvedFiles = files.map(file => ({
      fileName: file.originalname,
      filePath: file.path,
      approved: false,
    }));

    const newCollection = new Collection({ name, approvedFiles });
    await newCollection.save();

    res.status(201).json({ message: 'Collection created', collection: newCollection });
  } catch (error) {
    console.error('Error saving collection:', error);
    res.status(500).send({ message: 'Error saving collection' });
  }
};

// Get all collections
const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching collections' });
  }
};

// Delete collection
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).send({ message: 'Collection not found' });
    }

    const deletePromises = collection.approvedFiles.map(file =>
      fs.promises.unlink(file.filePath).catch(err => {
        console.error(`Failed to delete file ${file.filePath}:`, err);
      })
    );

    await Promise.all(deletePromises);
    await Collection.findByIdAndDelete(req.params.id);

    res.status(200).send({ message: 'Collection and associated files deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).send({ message: 'Error deleting collection' });
  }
};

// Add a section to a collection
const addSectionToCollection = async (req, res) => {
  const { sectionName } = req.body;
  try {
    const collection = await Collection.findById(req.params.id);
    collection.approvedFiles.push({ section_name: sectionName, data: [] });
    await collection.save();
    res.status(201).json({ message: 'Section added', collection });
  } catch (error) {
    res.status(500).send({ message: 'Error adding section' });
  }
};

// Delete a section from a collection
const deleteSectionFromCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    collection.approvedFiles = collection.approvedFiles.filter(
      section => section._id.toString() !== req.params.sectionId
    );
    await collection.save();
    res.status(200).json({ message: 'Section deleted', collection });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting section' });
  }
};

// Update a section in a collection
const updateSectionInCollection = async (req, res) => {
  const { sectionName } = req.body;
  try {
    const collection = await Collection.findById(req.params.id);
    const section = collection.approvedFiles.id(req.params.sectionId);
    if (section) {
      section.section_name = sectionName;
      await collection.save();
      res.status(200).json({ message: 'Section updated', collection });
    } else {
      res.status(404).send({ message: 'Section not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error updating section' });
  }
};

module.exports = {
  createCollection,
  getAllCollections,
  deleteCollection,
  addSectionToCollection,
  deleteSectionFromCollection,
  updateSectionInCollection,
};
