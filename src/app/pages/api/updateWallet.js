import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { userId, amount, transactionHash } = req.body;

    try {
      const user = await User.findOne({ id: userId });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Just track the sent amount and leave the balance unchanged
      user.wallet.amount_sent += amount; // Track the amount sent in transactions
      user.wallet.transaction_status = 'pending'; // Set transaction status as pending (for example)
      user.wallet.transaction_hash = transactionHash; // Save transaction hash

      await user.save(); // Save changes to the user

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}
