// /api/storeData.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { password } = req.body;

    // Add a password validation logic if necessary
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Save data to the database (in this case, log it)
    console.log('Password received:', password);

    return res.status(200).json({ message: 'Password saved successfully!' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
