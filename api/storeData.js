import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;

if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

export default async function handler(req, res) {
    const AUTH_TOKEN = process.env.AUTH_TOKEN;

    // Check token
    const token = req.headers.authorization;
    if (token !== `Bearer ${AUTH_TOKEN}`) {
        return res.status(403).json({ error: 'Invalid Token' });
    }

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
            const result = await collection.insertOne({ password, timestamp: new Date() });

            return res.status(200).json({ message: 'Password saved successfully!', result });
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);  // Log the specific error
            return res.status(500).json({ error: 'Failed to save password', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
