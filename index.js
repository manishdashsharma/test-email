import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDB URI
const mongoURI =
  'mongodb+srv://manish:q1e2r3s4@cluster0.qvpi8dz.mongodb.net/email?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true';

await mongoose.connect(mongoURI);
console.log('✅ Connected to MongoDB');

// Flexible schema (no model file)
const DynamicSchema = new mongoose.Schema({}, { strict: false });
const PayloadModel = mongoose.model('Payload', DynamicSchema, 'Emails');

// Routes
app.get('/', (req, res) => {
  res.send('🚀 Server is up and running!');
});

// Save payload
app.post('/save', async (req, res) => {
  try {
    const finalPayload = req.body;

    if (!finalPayload || typeof finalPayload !== 'object') {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const doc = new PayloadModel(finalPayload);
    const savedDoc = await doc.save();

    res.status(201).json({ message: '✅ Data saved', id: savedDoc._id });
  } catch (error) {
    console.error('❌ Error saving data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch all payloads
app.get('/all', async (req, res) => {
  try {
    const allDocs = await PayloadModel.find({});
    res.status(200).json(allDocs);
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🌍 Server listening at http://localhost:${port}`);
});
