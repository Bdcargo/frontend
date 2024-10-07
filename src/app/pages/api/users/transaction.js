import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { userId, amount, transactionHash } = req.body;

    try {
      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Check if the user has enough balance to send the specified amount
      if (user.wallet.balance < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }

      // Update wallet balance and transaction details
      user.wallet.balance -= amount; // Deduct the amount from the wallet balance
      user.wallet.amount_sent += amount; // Track the amount sent in transactions
      user.wallet.transaction_status = 'successful'; // Update transaction status
      user.wallet.transaction_hash = transactionHash; // Save transaction hash

      await user.save(); // Save changes to the user

      // Update referral status if this user was referred
      if (user.referredBy) {
        const referrer = await User.findById(user.referredBy);
        if (referrer) {
          const referral = referrer.referrals.find(r => r.user.toString() === user._id.toString());
          if (referral) {
            referral.status = 'active'; // Set referral status to 'active' on successful transaction
            await referrer.save();
          }
        }
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}
