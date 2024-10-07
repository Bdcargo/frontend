import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { userId } = req.query;

    try {
      const user = await User.findById(userId).populate('referrals.user', 'username wallet.transaction_status');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, referrals: user.referrals });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.setHeader('Allow', ['GET']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}
