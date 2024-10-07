import dbConnect from '../../utils/dbConnect'; // Utility to connect to MongoDB
import User from '../../models/User'; // User model

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { id, username, first_name, last_name } = req.body;

    try {
      // Check if the user already exists
      let user = await User.findOne({ id });

      if (!user) {
        // If user doesn't exist, create a new one with wallet properties
        user = await User.create({
          id,
          username,
          first_name,
          last_name,
          wallet: {
            balance: 0, // Initialize balance to 0
            transaction_status: 'inactive', // Set initial transaction status
            number_referred: 0, // Initialize number referred to 0
            transaction_hash: '', // Initialize transaction hash to an empty string
          },
        });
      } else {
        // Update existing user with new properties if needed
        user.username = username;
        user.first_name = first_name;
        user.last_name = last_name;

        await user.save(); // Save changes
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}
