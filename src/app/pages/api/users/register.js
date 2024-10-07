import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, referredBy } = req.body;

    try {
      // Create a new user and save referral info
      const newUser = new User({
        username,
        referredBy: referredBy || null // Set the referrer if available
      });
      
      await newUser.save();

      // If referredBy is present, update referrer's referral list
      if (referredBy) {
        const referrer = await User.findById(referredBy);
        if (referrer) {
          referrer.referrals.push({
            user: newUser._id,
            status: 'inactive', // Initially set as 'inactive' until the first successful transaction
          });
          await referrer.save();
        }
      }

      return res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
