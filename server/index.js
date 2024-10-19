

// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');

// const app = express();

// // Middleware to parse incoming JSON
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/collections', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Define a schema and model for your collections
// const collectionSchema = new mongoose.Schema({
//   name: String,
//   approvedFiles: [{
//     fileName: String,
//     filePath: String,
//     approved: Boolean,
//   }],
// });

// const Collection = mongoose.model('Collection', collectionSchema);

// // Set up Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage });

// // Route to upload files with metadata
// app.post('/api/collections', upload.array('files'), async (req, res) => {
//   const { name } = req.body;
//   const files = req.files;

//   try {
//     const approvedFiles = files.map(file => ({
//       fileName: file.originalname,
//       filePath: file.path,
//       approved: false
//     }));

//     const newCollection = new Collection({ name, approvedFiles });
//     await newCollection.save();

//     res.status(201).json({ message: 'Collection created', collection: newCollection });
//   } catch (error) {
//     console.error('Error saving collection:', error);
//     res.status(500).send({ message: 'Error saving collection' });
//   }
// });

// // Route to get all collections
// app.get('/api/collections', async (req, res) => {
//   try {
//     const collections = await Collection.find();
//     res.status(200).json(collections);
//   } catch (error) {
//     res.status(500).send({ message: 'Error fetching collections' });
//   }
// });

// // Route to delete a collection
// app.delete('/api/collections/:id', async (req, res) => {
//   try {
//     // Find the collection first to get the file paths
//     const collection = await Collection.findById(req.params.id);
//     if (!collection) {
//       return res.status(404).send({ message: 'Collection not found' });
//     }

//     // Delete each file associated with the collection
//     const deletePromises = collection.approvedFiles.map(file => {
//       return fs.promises.unlink(file.filePath).catch(err => {
//         console.error(`Failed to delete file ${file.filePath}:`, err);
//       });
//     });

//     // Wait for all delete operations to complete
//     await Promise.all(deletePromises);

//     // Now delete the collection from the database
//     await Collection.findByIdAndDelete(req.params.id);
    
//     res.status(200).send({ message: 'Collection and associated files deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting collection:', error);
//     res.status(500).send({ message: 'Error deleting collection' });
//   }
// });

// // Route to add a section to a collection
// app.post('/api/collections/:id/sections', async (req, res) => {
//   const { sectionName } = req.body;
//   try {
//     const collection = await Collection.findById(req.params.id);
//     collection.approvedFiles.push({ section_name: sectionName, data: [] });
//     await collection.save();
//     res.status(201).json({ message: 'Section added', collection });
//   } catch (error) {
//     res.status(500).send({ message: 'Error adding section' });
//   }
// });

// // Route to delete a section from a collection
// app.delete('/api/collections/:id/sections/:sectionId', async (req, res) => {
//   try {
//     const collection = await Collection.findById(req.params.id);
//     collection.approvedFiles = collection.approvedFiles.filter(
//       section => section._id.toString() !== req.params.sectionId
//     );
//     await collection.save();
//     res.status(200).json({ message: 'Section deleted', collection });
//   } catch (error) {
//     res.status(500).send({ message: 'Error deleting section' });
//   }
// });

// // Route to edit a section in a collection
// app.put('/api/collections/:id/sections/:sectionId', async (req, res) => {
//   const { sectionName } = req.body;
//   try {
//     const collection = await Collection.findById(req.params.id);
//     const section = collection.approvedFiles.id(req.params.sectionId);
//     if (section) {
//       section.section_name = sectionName;
//       await collection.save();
//       res.status(200).json({ message: 'Section updated', collection });
//     } else {
//       res.status(404).send({ message: 'Section not found' });
//     }
//   } catch (error) {
//     res.status(500).send({ message: 'Error updating section' });
//   }
// });

// // Test route to check if the server is running
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });






const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const collectionRoutes = require('./routes/collectionRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/collections', collectionRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});







